import { CrudInterface, Table, OmitId } from 'brackets-manager'
import {
  Stage,
  Group,
  Round,
  Match,
  MatchGame,
  Participant,
} from 'brackets-model'
import prisma from '@/lib/prisma'
import { deepMerge, filterArrayOfObjects } from '@/utils/crudUtils'

interface DataTypes {
  stage: Stage
  group: Group
  round: Round
  match: Match
  match_game: MatchGame
  participant: Participant
}

export class MyDB implements CrudInterface {
  private tournamentId: string
  private tournamentData: {
    stage: Stage[]
    group: Group[]
    round: Round[]
    match: Match[]
    match_game: MatchGame[]
    participant: Participant[]
  }

  constructor(tournamentId: string, data: any) {
    this.tournamentId = tournamentId
    this.tournamentData = {
      stage: data.stage || [],
      group: data.group || [],
      round: data.round || [],
      match: data.match || [],
      match_game: data.match_game || [],
      participant: data.participant || [],
    }
  }

  static async build(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    })

    if (!tournament) {
      throw new Error('Invalid Tournament Id')
    }

    return new MyDB(tournamentId, {
      stage: tournament.stage || [],
      group: tournament.group || [],
      round: tournament.round || [],
      match: tournament.match || [],
      match_game: tournament.match_game || [],
      participant: tournament.participant || [],
    })
  }

  private async saveTournament() {
    try {
      await prisma.tournament.update({
        where: { id: this.tournamentId },
        data: {
          stage: this.tournamentData.stage,
          group: this.tournamentData.group,
          round: this.tournamentData.round,
          match: this.tournamentData.match,
          match_game: this.tournamentData.match_game,
          participant: this.tournamentData.participant,
        },
      })
    } catch (error) {
      console.error('Error saving tournament data:', error)
      throw error
    }
  }

  // INSERT
  /**
   * Inserts multiple values in the database.
   *
   * @param table Where to insert.
   * @param values What to insert.
   */
  public async insert<T extends Table>(
    table: T,
    value: OmitId<DataTypes[T]>
  ): Promise<number>
  /**
   * Inserts multiple values in a table.
   *
   * @param table Where to insert.
   * @param values What to insert.
   */
  public async insert<T extends Table>(
    table: T,
    values: OmitId<DataTypes[T]>[]
  ): Promise<boolean>

  /**
   * Inserts a unique value or multiple values in a table.
   *
   * @param table Name of the table.
   * @param arg A single value or an array of values.
   */
  public async insert<T extends Table>(
    table: T,
    arg: OmitId<DataTypes[T]> | OmitId<DataTypes[T]>[]
  ): Promise<number | boolean> {
    try {
      let lastIndex = (this.tournamentData[table] as any[]).length - 1

      if (!Array.isArray(arg)) {
        // add the data to the database
        const id = lastIndex + 1
        const newValue = {
          ...arg,
          id,
        } as DataTypes[T]

        this.tournamentData[table].push(newValue)
        await this.saveTournament()
        return id
      }

      // add the array to the database
      const newValues = arg.map(
        (el) => ({ ...el, id: ++lastIndex } as DataTypes[T])
      )
      this.tournamentData[table].push(...newValues)
      await this.saveTournament()
      return true
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error)
      return Array.isArray(arg) ? false : -1
    }
  }

  //SELECT
  /**
   * Gets all data from a table in the database.
   *
   * @param table Where to get from.
   */
  public select<T extends Table>(table: T): Promise<Array<DataTypes[T]> | null>
  /**
   * Gets specific data from a table in the database.
   *
   * @param table Where to get from.
   * @param id What to get.
   */
  public select<T extends Table>(
    table: T,
    id: number
  ): Promise<DataTypes[T] | null>
  /**
   * Gets data from a table in the database with a filter.
   *
   * @param table Where to get from.
   * @param filter An object to filter data.
   */
  public select<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>
  ): Promise<Array<DataTypes[T]> | null>

  /**
   * Gets a unique elements, elements matching a filter or all the elements in a table.
   *
   * @param table Name of the table.
   * @param arg An index or a filter.
   */
  public async select<T extends Table>(
    table: T,
    arg?: number | Partial<DataTypes[T]>
  ): Promise<DataTypes[T] | Array<DataTypes[T]> | null> {
    try {
      if (arg === undefined) {
        const res = this.tournamentData[table] as DataTypes[T][]
        if (res.length === 0) return null
        return res
      }

      if (typeof arg === 'number') {
        // return the specific data
        const data = (this.tournamentData[table] as DataTypes[T][]).find(
          (value) => value.id === arg
        )
        return data || null
      }

      // there is a filter, and use the filter to select the data
      const filteredArr = filterArrayOfObjects(
        this.tournamentData[table] as any[],
        arg as any
      )
      if (filteredArr.length === 0) return null
      return filteredArr as DataTypes[T][]
    } catch (error) {
      console.error(`Error selecting from ${table}:`, error)
      return null
    }
  }

  //UPDATE
  /**
   * Updates data in a table.
   *
   * @param table Where to update.
   * @param id What to update.
   * @param value How to update.
   */
  public update<T extends Table>(
    table: T,
    id: number,
    value: DataTypes[T]
  ): Promise<boolean>
  /**
   * Updates data in a table.
   *
   * @param table Where to update.
   * @param filter An object to filter data.
   * @param value How to update.
   */
  public update<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>,
    value: Partial<DataTypes[T]>
  ): Promise<boolean>

  /**
   * Updates one or multiple elements in a table.
   *
   * @param table Name of the table.
   * @param arg An index or a filter.
   * @param value The whole object if arg is an index or the values to change if arg is a filter.
   */
  public async update<T extends Table>(
    table: T,
    arg: number | Partial<DataTypes[T]>,
    value: DataTypes[T] | Partial<DataTypes[T]>
  ): Promise<boolean> {
    try {
      if (typeof arg === 'number') {
        // update the value and return true or false based on the success
        const index = (this.tournamentData[table] as DataTypes[T][]).findIndex(
          (val) => val.id === arg
        )
        if (index === -1) return false

        this.tournamentData[table][index] = {
          ...this.tournamentData[table][index],
          ...value,
        } as any
        await this.saveTournament()
        return true
      }

      // use this place to update the data using the filter
      const tableData = this.tournamentData[table] as any[]
      tableData.forEach((el, index) => {
        const isMatch = Object.entries(arg).every(
          ([key, filterValue]) => el[key] === filterValue
        )
        if (isMatch) {
          const merged = deepMerge(el, value)
          this.tournamentData[table][index] = merged
        }
      })

      await this.saveTournament()
      return true
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      return false
    }
  }

  //DELETE
  /**
   * Empties a table completely.
   *
   * @param table Where to delete everything.
   */
  delete<T extends Table>(table: T): Promise<boolean>
  /**
   * Delete data in a table, based on a filter.
   *
   * @param table Where to delete in.
   * @param filter An object to filter data.
   */
  delete<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>
  ): Promise<boolean>

  /**
   * Delete data in a table, based on a filter.
   *
   * @param table Where to delete in.
   * @param filter An object to filter data or undefined to empty the table.
   */
  public async delete<T extends Table>(
    table: T,
    filter?: Partial<DataTypes[T]>
  ): Promise<boolean> {
    try {
      if (!filter) {
        // delete all the data
        this.tournamentData[table] = [] as any
        await this.saveTournament()
        return true
      }

      // delete data using the filter provided
      const initialLength = (this.tournamentData[table] as any[]).length
      this.tournamentData[table] = (this.tournamentData[table] as any[]).filter(
        (val) =>
          Object.entries(filter).some(([key, value]) => val[key] !== value)
      ) as any

      const deletedAny =
        (this.tournamentData[table] as any[]).length < initialLength
      if (deletedAny) {
        await this.saveTournament()
      }
      return true
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error)
      return false
    }
  }
}
