interface IAuthLayoutProps {
  children: React.ReactNode
  isSignUp?: boolean
}

export default function AuthLayout({ children, isSignUp }: IAuthLayoutProps) {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center bg-[url('/images/bg-image.jpg')]">
      <div className="absolute inset-0 top-0 w-full h-full overflow-hidden">
        {isSignUp && (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(3, 236, 214, 0.50) 0%, rgba(255, 84, 84, 0.50) 100%)',
              filter: 'blur(160px)',
              opacity: 0.7,
            }}
          ></div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(0deg, #060812 0%, rgba(6, 8, 18, 0.85) 40%, rgba(6, 8, 18, 0.00) 100%)',
          }}
        ></div>
      </div>
      {children}
    </section>
  )
}
