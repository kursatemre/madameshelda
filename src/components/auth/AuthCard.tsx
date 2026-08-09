export function AuthCard({
  title, subtitle, children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-brown text-3xl mb-2" style={{ fontStyle: "italic" }}>
            {title}
          </h1>
          {subtitle && <p className="text-[#888480] font-light text-sm">{subtitle}</p>}
        </div>
        {children && <div className="border border-sand p-6 sm:p-8">{children}</div>}
      </div>
    </div>
  );
}
