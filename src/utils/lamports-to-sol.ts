export function lamportsToSol(lamports: number | bigint): number {
  const value = typeof lamports === 'bigint' ? Number(lamports) : lamports
  return value / 1_000_000_000
}


