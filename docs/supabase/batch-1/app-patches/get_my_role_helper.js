/**
 * CyberPath — authoritative role helper (B0/B1)
 * Do not read role from user_profile or user_metadata.
 */
export async function getMyRole(supabase) {
  const { data, error } = await supabase.rpc('get_my_role');
  if (error) {
    console.error('get_my_role failed', error);
    return null;
  }
  return data;
}

export async function requireRole(supabase, allowed) {
  const role = await getMyRole(supabase);
  if (!role || !allowed.includes(role)) {
    const err = new Error('forbidden');
    err.code = 'FORBIDDEN_ROLE';
    throw err;
  }
  return role;
}
