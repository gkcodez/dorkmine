"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

import {
  HeartIcon,
  FolderOpen,
  Edit,
  Save,
  FolderCog,
  Folder,
  Calendar,
  LogOutIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { format } from "date-fns";

export default function Home() {
  const [dorks, setDorks] = useState<Dork[]>([]);
  const [favoriteDorks, setFavoriteDorks] = useState<Dork[]>([]);
  const [target, setTarget] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isUpdatingTarget, setIsUpdatingTarget] = useState<boolean>(false);

  useEffect(() => {
    const localTarget = getFromLocalStorage("target");
    if (localTarget) {
      setTarget(localTarget);
    }
    fetchDorks();
  }, []); // Runs once when component mounts.

  const fetchDorks = async () => {
    try {
      const response = await fetch("/api/dorks"); // Adjust API URL if needed
      if (!response.ok) {
        throw new Error("Failed to fetch dorks");
      }
      const allDorks = await response.json();
      setDorks(allDorks);
      setFavoriteDorks(
        allDorks.filter((x: { favorite: boolean }) => x.favorite)
      );
    } catch (error) {
      console.error("Error fetching dorks:", error);
    }
  };

  const searchDorks = async () => {
    try {
      const response = await fetch(`/api/dorks?title=${search}`); // Adjust API URL if needed
      if (!response.ok) {
        throw new Error("Failed to fetch dorks");
      }
      const data = await response.json();
      setDorks(data);
    } catch (error) {
      console.error("Error fetching dorks:", error);
    }
  };

  function googleSearch(dork: Dork) {
    let searchTerm = dork.value;
    if (target && dork.category != "Bug Bounty Programs") {
      searchTerm = `site: ${target} ${searchTerm}`;
    }
    const baseUrl = "https://www.google.com";
    const url = `${baseUrl}/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(url, `${dork.title}`);
  }

  const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTarget = event.target.value;
    setTarget(currentTarget);
    saveToLocalStorage("target", currentTarget);
  };

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingTarget(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchDorks();
  };

  const toggleFavorite = async (id: string | undefined) => {
    try {
      const response = await fetch(`/api/dorks/${id}/toggleFavorites`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to toggle favorite");

      // const updatedDork = await response.json();

      // // Update UI
      // setDorks((prevDorks) =>
      //   prevDorks.map((dork) =>
      //     dork.id === id ? { ...dork, favorite: updatedDork.favorite } : dork
      //   )
      // );
      fetchDorks();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };


  const handleEditButtonClick = () => {
    setIsUpdatingTarget(true);
  };

  const bulkOpenDorks = (dorks: Dork[]) => {
    // Bulk open dorks is blocked by browser.
    // for(let dork of dorks) {
    //   googleSearch(dork);
    // }
  };

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
              {!isUpdatingTarget && (
                <div className="flex items-center gap-2">
                  <span id="currentTarget" className="text-red-600">
                    {target}
                  </span>
                  <Edit onClick={handleEditButtonClick} />
                </div>
              )}
              {isUpdatingTarget && (
                <div className="flex items-center gap-2">
                  <form
                    onSubmit={handleTargetSubmit}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={target}
                      onChange={handleTargetChange}
                      placeholder="Enter your target domain"
                    />
                    <Button variant="ghost" type="submit">
                      <Save />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="favoriteDorks p-2">
            <div className="flex items-center justify-items-center p-2 w-full gap-2">
              <h3 className="flex items-center gap-2 text-left text-xl font-bold tracking-tight lg:text-2xl text-indigo-600">
                <FolderOpen /> Favorites  <LogOutIcon onClick={() => bulkOpenDorks(favoriteDorks)}/>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2 w-full">
              {favoriteDorks.map((dork, index) => (
                <Card
                key={index}
                className="flex flex-col h-full justify-between shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex flex-col justify-start">
                <div className="w-full flex items-start justify-between">
                  <CardHeader
                    className="text-md w-full flex items-start justify-between"
                    onClick={() => googleSearch(dork)}
                  >
                    <CardTitle>{dork.title}</CardTitle>
                  </CardHeader>
                  <HeartIcon
                    onClick={() => toggleFavorite(dork.id)}
                    className={`${dork.favorite ? "fill-red-600 text-red-700" : ""} relative top-2 right-2`}
                  />
                </div>

                <CardContent onClick={() => googleSearch(dork)}>
                  <p className="text-sm text-gray-600">{dork.description}</p>
                </CardContent>
                </div>
                <CardFooter
                  className="flex items-center justify-between w-full"
                  onClick={() => googleSearch(dork)}
                >
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Folder />
                    <p>{dork.category}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Calendar />
                    <p>
                      {dork.createdAt
                        ? format(dork.createdAt, "dd/MM/yyyy")
                        : ""}
                    </p>
                  </div>
                </CardFooter>
              </Card>
              ))}
            </div>
          </div>
          <div className="allDorks p-2">
            <div className="flex items-center justify-items-center p-2 w-full">
              <h3 className="flex items-center gap-2 text-left text-xl font-bold tracking-tight lg:text-2xl text-indigo-600">
                <FolderOpen /> All Dorks <LogOutIcon />
              </h3>
            </div>
            <div className="flex gap-2 flex-1 w-full lg:w-1/3 p-2">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search dorks by title"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-800 text-white">
                Search
              </Button>
            </form>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2 w-full">
              {dorks.map((dork, index) => (
                <Card
                key={index}
                className="flex flex-col h-full justify-between shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex flex-col justify-start">
                <div className="w-full flex items-start justify-between">
                  <CardHeader
                    className="text-md w-full flex items-start justify-between"
                    onClick={() => googleSearch(dork)}
                  >
                    <CardTitle>{dork.title}</CardTitle>
                  </CardHeader>
                  <HeartIcon
                    onClick={() => toggleFavorite(dork.id)}
                    className={`${dork.favorite ? "fill-red-600 text-red-700" : ""} relative top-2 right-2`}
                  />
                </div>

                <CardContent onClick={() => googleSearch(dork)}>
                  <p className="text-sm text-gray-600">{dork.description}</p>
                </CardContent>
                </div>
                <CardFooter
                  className="flex items-center justify-between w-full"
                  onClick={() => googleSearch(dork)}
                >
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Folder />
                    <p>{dork.category}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Calendar />
                    <p>
                      {dork.createdAt
                        ? format(dork.createdAt, "dd/MM/yyyy")
                        : ""}
                    </p>
                  </div>
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
