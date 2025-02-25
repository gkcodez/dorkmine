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

import { useEffect, useMemo, useState } from "react";

import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { Dork } from "@/models/dork";
import React from "react";

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
        selectedCategory === "" || dork.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
    console.log(selectedCategory);
    console.log("Filtered dorks:", results);
    return results;
  }, [search, dorks, selectedCategory]);

  function googleSearch(dork: Dork) {
    let searchTerm = dork.content;
    searchTerm = searchTerm.replaceAll("[TARGET]", target);
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
    console.log("Selected category:", value);
  };

  return (
    <div className="flex flex-col items-center justify-items-center gap-3 w-full h-full">
      <div className="flex flex-col items-center justify-items-center w-full">
        <div className="flex flex-col items-center gap-2 text-center w-full bg-cyan-600 p-2">
          <div className="p-2">
            <div className="flex items-start justify-center text-white ">
              <h1 className="flex items-center text-4xl font-bold tracking-wide p-1">

                D<SearchCheckIcon className="text-amber-300 font-bold w-10 h-10" />rkmine
              </h1>
              1.0.0
            </div>
            <a
              href="http://linkedin.com/in/gkcodez"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-col items-center justify-center gap-1 text-white">
                <p>
                  Developed by: <span className="text-amber-300 underline">@gkcodez</span>
                </p>
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 w-full sticky top-0 bg-cyan-600 text-white p-3 shadow-md">
          <form
            className="flex flex-col md:flex-row items-center gap-2 w-full md:w-3/4 lg:w-1/2"
          >
            <div className="relative w-full">
              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search dorks..."
                className="text-gray-600 pl-10 pr-5 py-5 bg-white rounded-lg shadow-sm w-full"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
            <Select onValueChange={(value) => handleCategoryChange(value)}>
              <SelectTrigger className="bg-white rounded-lg text-gray-600 shadow-sm w-full md:w-1/3 p-5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>{category}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </form>

          {
            dorks?.length > 0 &&
            <div className="flex md:flex-row items-start justify-center gap-2">
              <p className="flex items-center justify-center gap-2">
                <SearchIcon/> Total Dorks: {dorks?.length}
              </p>
              <p className="flex items-center justify-center gap-2">
                <FilterIcon/> Filtered Dorks: {filteredDorks.length}
              </p>
            </div>


          }

        </div>
        <div className="flex flex-col w-full">
          <div className="allDorks p-2">
            <div className="flex items-center justify-start gap-2 flex-1 w-full p-2">
              <div className="flex items-center justify-start gap-2 w-full">
                <span className="font-bold flex items-center gap-2">
                  <TargetIcon /> Target:{" "}
                </span>{" "}
                {!isUpdatingTarget && (
                  <div className="flex items-center gap-2">
                    <span id="currentTarget" className="text-amber-600">
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
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 p-2 w-full">
              {filteredDorks.map((dork, index) => (
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
                        <CardTitle className="flex items-center justify-start gap-3 text-md font-semibold">
                          <Image
                            src={`/images/icons/${dork.icon}`}
                            onError={(e) => e.currentTarget.src = "/images/icons/search.svg"} // Replace with your image
                            alt="dork-icon"
                            width={40}
                            height={40}
                            className="rounded-lg"
                          /> {dork.title}</CardTitle>
                      </CardHeader>
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
          </div>
        </div>
      </div>
    </div>
  );
}
