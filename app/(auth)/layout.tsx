export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex justify-center w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300 to-sky-950'>
      {children}
    </div>
  )
}
