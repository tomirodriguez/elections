export function getTopCandidates(
  categories: { code: string; name: string; candidates: any[] }[],
  size: number
) {
  return categories.map(
    (category: { code: string; name: string; candidates: any[] }) => {
      const { code, name, candidates } = category;
      const firstFive = category.candidates.slice(0, size);

      return { code, name, topCandidates: firstFive };
    }
  );
}
