import NavigationButton from './NavigationButton';

export default function Navigation() {
  return (
    <nav className="flex md:flex-row flex-col md:items-center md:space-x-2 md:space-y-0 space-y-2">
      <NavigationButton 
        label="Buy" 
        href="/search" 
        isActive={true} 
      />
      <NavigationButton 
        label="Home Evaluation" 
        href="/home-evaluation" 
        isActive={false} 
      />
    </nav>
  );
}