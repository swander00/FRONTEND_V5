import { getUserIPAddress } from './ipHelpers';

export async function createUserProfile(userId: string, email: string, firstName?: string, lastName?: string) {
  try {
    const ipAddress = await getUserIPAddress();
    
    // Mock implementation - just log the data
    console.log('Mock: Creating user profile', {
      id: userId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      ip_address: ipAddress,
    });

    return { success: true, data: { id: userId, email, first_name: firstName, last_name: lastName } };
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return { success: false, error };
  }
}

export async function handleGoogleSignUp() {
  try {
    // Mock implementation - simulate OAuth flow
    console.log('Mock: Initiating Google OAuth signup');
    
    // Simulate redirect
    setTimeout(() => {
      window.location.href = `${window.location.origin}/auth/callback`;
    }, 1000);

    return { success: true, data: { provider: 'google' } };
  } catch (error) {
    console.error('Error in handleGoogleSignUp:', error);
    return { success: false, error };
  }
} 