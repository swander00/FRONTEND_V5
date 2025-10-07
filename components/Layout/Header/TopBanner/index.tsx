import BannerText from './BannerText';

export default function TopBanner() {
  return (
    <div className="bg-blue-600 text-white py-2">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <BannerText />
      </div>
    </div>
  );
}