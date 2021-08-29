import Head from "next/head";
import { useEffect, useState } from "react";
import ApiResponse from "../model/ApiResponse";
import { Category } from "../model/Category";
import { Region } from "../model/Region";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>();

  useEffect(() => {
    fetch("/api/region")
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        if (json.error) throw new Error(json.message);
        const { regions } = json.response;

        setRegions(regions);
        // setCurrentCategory(regions[0]);
      });
  }, []);
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        if (json.error) throw new Error(json.message);
        const { categories } = json.response;

        setCategories(categories);
        setCurrentCategory(categories[0]);
      });
  }, []);

  useEffect(() => {
    if (currentCategory)
      fetch(`/api/categories/${currentCategory.code}`)
        .then((res) => res.json())
        .then((json: ApiResponse) => {
          if (json.error) throw new Error(json.message);
          const { response } = json;
          console.log(response);
        });
  }, [currentCategory]);

  return (
    <div>
      <Head>
        <title>PASO 2019</title>
        <meta name="description" content="Elecciones PASO 2019" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {categories.length === 0 ? (
          <div>LOADING</div>
        ) : (
          <ul>
            {categories.map((cat: Category) => (
              <li key={cat.code}>{cat.name}</li>
            ))}
          </ul>
        )}
      </main>

      <footer></footer>
    </div>
  );
}
