// BloomBrain Portal Auth Utilities (Client-Safe Mock)
export async function requireRole(role: 'explorer' | 'guardian') {
  // Simple simulation of session checking to stay within the browser environment
  const mockUser = { role: 'guardian' }; // Assume guardian for selection demo
  if (role === 'guardian' && mockUser.role !== 'guardian') {
    throw new Error("Unauthorized");
  }
  return true;
}

export const portalMetadata = {
  title: "BloomBrain – AI Cognitive Growth for Children",
  description: "Trusted AI platform for child brain development. Ethical. Calm. Science-backed.",
};
