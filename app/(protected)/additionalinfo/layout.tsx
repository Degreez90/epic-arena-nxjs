const AddInfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300 to-sky-950'>
      {children}
    </div>
  )
}

export default AddInfoLayout
