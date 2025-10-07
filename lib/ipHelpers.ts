export async function getUserIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return '';
  }
}

export async function getIpLocation(ip: string): Promise<{ city?: string; postal?: string } | null> {
  try {
    console.log('Making API call to ip-api.com for IP:', ip);
    
    // Try ip-api.com first (no CORS issues)
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,city,zip`);
    console.log('API response status:', res.status);
    
    if (!res.ok) {
      console.error('API response not ok:', res.status, res.statusText);
      throw new Error('Failed to fetch IP location');
    }
    
    const data = await res.json();
    console.log('Raw API response:', data);
    
    // Check if the API returned an error
    if (data.status === 'fail') {
      console.error('IP API returned error:', data.message);
      return null;
    }
    
    // Only return city and postal code
    return {
      city: data.city,
      postal: data.zip
    };
  } catch (error) {
    console.error('Failed to get IP location:', error);
    // Fallback: try a different API if the first one fails
    try {
      console.log('Trying fallback API...');
      const fallbackRes = await fetch(`https://ipapi.co/${ip}/json/`);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        console.log('Fallback API response:', fallbackData);
        return {
          city: fallbackData.city,
          postal: fallbackData.postal
        };
      }
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
    }
    return null;
  }
} 