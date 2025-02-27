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
  Edit,
  Save,
  Folder,
  TargetIcon,
  SearchIcon,
  FilterIcon,
  SearchCheckIcon,
  InfoIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"

import { useEffect, useMemo, useState } from "react";

import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { Dork } from "@/models/dork";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const [dorks, setDorks] = useState<Dork[]>([]);
  const [target, setTarget] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isUpdatingTarget, setIsUpdatingTarget] = useState<boolean>(false);

  useEffect(() => {
    const localTarget = getFromLocalStorage("target");
    if (localTarget) {
      setTarget(localTarget);
    }
    fetchDorks();
  }, []);

  const fetchDorks = async () => {
    fetch("/data/dorks.json")
      .then((res) => res.json())
      .then((data) => {
        setDorks(data);
        let categories = data.map((dork: Dork) => dork.category);
        categories = [...new Set(categories)];
        setCategories(categories);
      }).then(() => console.log("Dorks loaded successfully"))
      .catch((error) => console.error("Error loading cards:", error));
  };


  // Filtered Dorks
  const filteredDorks = useMemo(() => {
    let results = dorks.filter(dork => {
      const matchesSearch =
        dork.title.toLowerCase().includes(search.toLowerCase()) ||
        dork.description?.toLowerCase().includes(search.toLowerCase()) ||
        dork.content.toLowerCase().includes(search.toLowerCase()) ||
        dork.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || selectedCategory === "All" || dork.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
    return results;
  }, [search, dorks, selectedCategory]);

  function googleSearch(dork: Dork) {
    let searchTerm = dork.content;
    if (target) {
      searchTerm = searchTerm.replaceAll("[TARGET]", target);
    } else {
      searchTerm = searchTerm.replaceAll("site:", "").replaceAll("'[TARGET]'", "").replaceAll("[TARGET]", "");
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

  const handleEditButtonClick = () => {
    setIsUpdatingTarget(true);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <div className="flex flex-col items-center justify-items-center gap-3 w-full h-full">
      <div className="flex flex-col items-center justify-items-center w-full">
        <div className="flex flex-col items-center gap-2 text-center w-full bg-cyan-600 p-2 z-10">
          <div className="p-2">
            <div className="flex items-start justify-center text-white ">
              <h1 className="flex items-center text-4xl font-bold tracking-wide p-1">

                D<SearchCheckIcon className="text-yellow-400 font-bold w-12 h-12" />rkmine
              </h1>
            </div>
            <a
              href="http://linkedin.com/in/gkcodez"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col items-center justify-center gap-1 text-white">
                <p>
                  Developed by: <span className="text-yellow-300 relative group px-0 py-2">
                    @gkcodez
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                  </span>
                </p>
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 w-full sticky top-0 bg-cyan-600 text-white p-3 shadow-md z-10">
          <form
            className="flex items-center gap-2 w-full md:w-3/4 lg:w-1/2"
          >
            <div className="relative w-full flex items-center bg-white rounded-lg shadow-sm">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search dorks..."
                className="text-gray-600 w-7/12 pl-10 pr-5 py-5 bg-transparent flex-1 focus:ring-0 focus:outline-none focus:border-transparent"
              />
              <Select onValueChange={(value) => handleCategoryChange(value)} defaultValue="All">
                <SelectTrigger className="bg-transparent text-gray-600 border-none w-5/12 focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>{category}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
          <div className="flex md:flex-row items-start justify-center gap-2">
            <p className="flex items-center justify-center gap-2">
              <SearchIcon /> Total: {dorks?.length ?? 0}
            </p>
            <div className="h-6 w-[2px] bg-white mx-2"></div>
            <p className="flex items-center justify-center gap-2">
              <FilterIcon /> Filtered: {filteredDorks.length ?? 0}
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="allDorks p-2">
            <div className="flex items-center justify-start gap-2 flex-1 w-full p-2">
              <div className="flex items-center justify-start gap-2 w-full">
                <span className="font-bold flex items-center gap-2">
                  Target:{" "}
                </span>{" "}
                {!isUpdatingTarget && (
                  <div className="flex items-center gap-2">
                    <span id="currentTarget" className="text-yellow-400">
                      {target ? target : "Target not configured"}
                    </span>
                    <Button variant="default" type="button" onClick={handleEditButtonClick} className="bg-cyan-600 text-white hover:bg-cyan-700">
                      <Edit /> Edit
                    </Button>
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
                      <Button variant="default" type="submit" className="bg-cyan-600 text-white hover:bg-cyan-700">
                        <Save /> Save
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
            {dorks?.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 p-2 w-full">
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
                <Skeleton className="w-full h-48 rounded-md" />
              </div>
            )}
            {dorks?.length !== 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 p-2 w-full">
                {filteredDorks.map((dork, index) => (
                  <Card
                    key={index}
                    className="flex flex-col h-full justify-between shadow-md border border-gray-200 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col justify-start">
                      <div className="w-full flex items-start justify-between relative">
                        <CardHeader
                          className="text-md w-full flex items-start justify-between"
                          onClick={() => googleSearch(dork)}
                        >
                          <CardTitle className="flex items-center justify-start gap-3 text-md font-semibold w-full px-1">
                            <Image
                              src={`/images/icons/${dork.icon}`}
                              onError={(e) => e.currentTarget.src = "/images/icons/search.svg"} // Replace with your image
                              alt="dork-icon"
                              width={40}
                              height={40}
                              className="rounded-lg"
                            /> {dork.title}</CardTitle>
                        </CardHeader>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="absolute right-0 top-0"><InfoIcon /></Button>
                          </PopoverTrigger>
                          <PopoverContent className="z-5">
                            <div className="flex flex-col items-center justify-center gap-2 p-2">
                              <h3 className="text-md font-semibold">Details</h3>
                              <Separator />
                              <p className="text-sm text-gray-600">{dork.content}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <CardContent onClick={() => googleSearch(dork)}>
                        <p className="text-sm text-gray-600">
                          {dork.description}
                        </p>
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
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
