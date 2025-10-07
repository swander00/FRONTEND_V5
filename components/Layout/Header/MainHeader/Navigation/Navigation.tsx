import NavigationButton from './NavigationButton';

export default function Navigation() {
  return (
    <nav className="flex items-center space-x-2">
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