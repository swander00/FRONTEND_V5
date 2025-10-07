interface NavigationButtonProps {
  label: string;
  href: string;
  isActive?: boolean;
}

export default function NavigationButton({ label, href, isActive = false }: NavigationButtonProps) {
  return (
    <a
      href={href}
      className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {label}
    </a>
  );
}