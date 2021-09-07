import Head from "next/head";
import { useEffect, useState } from "react";
import ApiResponse from "../model/ApiResponse";
import { Category } from "../model/Category";
import { Region } from "../model/Region";

export default function Home() {
  const [categories, setCategories] = useState<any>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>();

  useEffect(() => {
    fetch("/data/regions.json")
      .then((res) => res.json())
      .then((json) => {
        setRegions(json);
      });
  }, []);

  useEffect(() => {
    fetch("/data/categories.json")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        setCategories(json);
        setCurrentCategory(json.president);
      });
  }, []);

  return (
    <div>
      <Head>
        <title>PASO 2019</title>
        <meta name="description" content="Elecciones PASO 2019" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ul
          className="d-flex jc-between"
          style={{
            backgroundColor: "gray",
            color: "white",
            textTransform: "uppercase",
            padding: "0 10px",
          }}
        >
          <li
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentCategory(categories?.president || null)}
          >
            Presidente
          </li>

          <li
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentCategory(categories?.governor || null)}
          >
            Gobernadores
          </li>

          <li
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentCategory(categories?.deputy || null)}
          >
            Diputados
          </li>

          <li
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentCategory(categories?.senator || null)}
          >
            Senadores
          </li>

          <li
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentCategory(categories?.mayor || null)}
          >
            Intendentes
          </li>
        </ul>
        <h2 style={{ marginTop: 30 }}>RESULTADOS</h2>
        {categories && currentCategory && (
          <ul>
            {currentCategory?.categories.map((cat: any) => (
              <li key={cat.code}>
                <h3>{cat.name}</h3>
                <ul style={{ margin: "15px 0" }}>
                  {cat.candidates.map((candidate: any) => (
                    <li key={candidate.list.code}>
                      <b>{candidate.totalVotes}</b> -{" "}
                      {candidate.agrupation.name} -{candidate.list.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        {
          
        }
      </main>

      <footer></footer>
    </div>
  );
}
