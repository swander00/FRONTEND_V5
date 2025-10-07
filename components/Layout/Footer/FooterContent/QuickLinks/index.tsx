const links = [
  'Buy Properties',
  'Rent Properties',
  'Sell Your Home',
  'About Us',
  'Contact',
  'Privacy Policy',
  'Terms of Service'
];

export default function QuickLinks() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}