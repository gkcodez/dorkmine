"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { HeartIcon, FolderOpen, Edit, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

export default function Home() {
  const [dorks, setDorks] = useState<Dork[]>([]);
  const [target, setTarget] = useState<string>("example.com")
  const [isUpdatingTarget, setIsUpdatingTarget] = useState<boolean>(false)

  useEffect(() => {
    const fetchDorks = async () => {
      try {
        const response = await fetch("/api/dorks"); // Adjust API URL if needed
        if (!response.ok) {
          throw new Error("Failed to fetch dorks");
        }
        const data = await response.json();
        setDorks(data);
      } catch (error) {
        console.error("Error fetching dorks:", error);
      }
    };

    fetchDorks();
  }, []); // Runs once when component mounts.


  function googleSearch(searchTerm: string) {
    if(target) {
      searchTerm = `site: ${target} ${searchTerm}`
    }
    const baseUrl = "https://www.google.com";
    const url = `${baseUrl}/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(url, "_blank");
  }

  const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(event.target.value);
  };

  const toggleFavorite = (event: Dork) => {
    console.log(event);
    
  }

  const handleEditButtonClick = () => {
    setIsUpdatingTarget(true);
  }

  const handleSaveButtonClick = () => {
    setIsUpdatingTarget(false);
  }


  return (
    <div className="flex flex-col items-center justify-items-center gap-3 w-full h-full px-2 py-10 lg:px-10 ">
                {/* <Image
            src="/target.svg" // Replace with your image
            alt="Target Image"
            width={300}
            height={300}
            className="rounded-lg"
          /> */}
      <div className="flex flex-col items-center justify-items-center gap-2 w-full">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-indigo-600">
            Dorkmine
          </h1>
          <a
            href="http://linkedin.com/in/gkcodez"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-gray-500">
              Developed by{" "}
              <span className="text-red-600 underline">@gkcodez</span>
            </p>
          </a>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center justify-start gap-2 flex-1 w-full p-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold">Target: </span>{" "}
              { !isUpdatingTarget && 
              <div className="flex items-center gap-2">
              <span
                id="currentTarget"
                className="text-red-600"
              >
                {target}
              </span>
              <Edit onClick={handleEditButtonClick}/>
              </div>
              }
              {
                isUpdatingTarget && 
                <div className="flex items-center gap-2">
                <Input value={target} onChange={handleTargetChange}/>
                <Save onClick={handleSaveButtonClick}/>

                </div>
              }
            </div>
          </div>
          <div className="flex gap-2 flex-1 w-full lg:w-1/3 p-2">
            <Input placeholder="Search dorks by title" />
            <Button className="bg-indigo-600 hover:bg-indigo-800 text-white">
              Search
            </Button>
          </div>
          <div className="favoriteDorks p-2">
            <div className="flex items-center justify-items-center p-2 w-full gap-2">
              <h3 className="flex items-center gap-2 text-left text-xl font-bold tracking-tight lg:text-2xl text-indigo-600">
                <FolderOpen /> Favorites <FolderOpen />
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2 w-full">
              {dorks
                .filter((x) => x.favorite)
                .map((dork, index) => (
                  <Card
                    key={index}
                    className="shadow-md border border-gray-200 hover:shadow-lg transition"
                  >
                    <div onClick={() => googleSearch(dork.value)}>
                      <CardHeader>
                        <CardTitle className="text-lg font-normal">
                          {dork.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{dork.description}</p>
                      </CardContent>
                    </div>
                    <CardFooter className="flex items-center justify-end w-full">
                      <HeartIcon
                        onClick={() => toggleFavorite(dork)}
                        className="fill-red-600 text-red-500"
                      />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
          <div className="allDorks p-2">
            <div className="flex items-center justify-items-center p-2 w-full">
              <h3 className="flex items-center gap-2 text-left text-xl font-bold tracking-tight lg:text-2xl text-indigo-600">
                <FolderOpen /> All Dorks
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2 w-full">
              {dorks.map((dork, index) => (
                <Card
                  key={index}
                  className="shadow-md border border-gray-200 hover:shadow-lg transition"
                >
                  <div onClick={() => googleSearch(dork.value)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-normal">
                        {dork.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{dork.description}</p>
                    </CardContent>
                  </div>
                  <CardFooter className="flex items-center justify-end w-full">
                    <HeartIcon onClick={() => toggleFavorite(dork)} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
