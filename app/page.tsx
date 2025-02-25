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
  Folder,
  Calendar,
  TargetIcon,
  SearchIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  Filter,
  SearchCheckIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { useEffect, useMemo, useState } from "react";

import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dork } from "@/models/dork";

export default function Home() {
  const [dorks, setDorks] = useState<Dork[]>([]);
  const [target, setTarget] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isUpdatingTarget, setIsUpdatingTarget] = useState<boolean>(false);
  const options = [
    { label: "Bug Bounty Programs", value: "bug_bounty_programs" },
    { label: "Sensitive Files", value: "sensitive_files" },
    { label: "Sensitive Functionalities", value: "sensitive_functionalities" },
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleFilterSubmit = (e: any) => {
    e.preventDefault();
    console.log("Selected Filters:", selectedOptions);
  };

  useEffect(() => {
    const localTarget = getFromLocalStorage("target");
    if (localTarget) {
      setTarget(localTarget);
    }
    fetchDorks();
  }, []); // Runs once when component mounts.

  const fetchDorks = async () => {
    fetch("/data/dorks.json")
      .then((res) => res.json())
      .then((data) => setDorks(data))
      .catch((error) => console.error("Error loading cards:", error));
  };


  // Filtered Dorks
  const filteredDorks = useMemo(() => {
    return dorks.filter(dork =>
      dork.title.toLowerCase().includes(search.toLowerCase()) ||
      dork.description?.toLowerCase().includes(search.toLowerCase()) ||
      dork.content.toLowerCase().includes(search.toLowerCase()) ||
      dork.category?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dorks]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchDorks();
  };

  const handleEditButtonClick = () => {
    setIsUpdatingTarget(true);
  };

  return (
    <div className="flex flex-col items-center justify-items-center gap-3 w-full h-full">
      {/* <Image
        src="/images/target.svg" // Replace with your image
        alt="Target Image"
        width={300}
        height={300}
        className="rounded-lg"
      /> */}
      <div className="flex flex-col items-center justify-items-center w-full">
        <div className="flex flex-col items-center gap-2 text-center w-full bg-cyan-100 p-2">
          <div className="p-2">
          <h1 className="flex items-center text-4xl font-bold tracking-widest text-cyan-600 p-2">
          
          D<SearchCheckIcon className="text-orange-600 font-bold w-10 h-10" />rkmine
          </h1>
          <a
            href="http://linkedin.com/in/gkcodez"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-cyan-600">
              Developed by{" "}
              <span className="text-orange-600 underline">@gkcodez</span>
            </p>
          </a>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 w-full bg-cyan-100 sticky top-0 p-5">
        <form
            onSubmit={handleSearchSubmit}
            className="flex flex items-start gap-2 w-full md:w-1/2"
          >
            <div className="relative w-full">
              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search dorks..."
                className="pl-10 bg-white text-gray-600"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
            {/* <Button><SearchIcon/></Button> */}
          </form>
          {/* <Popover>
            <PopoverTrigger>
              <SortDescIcon className="font-bold text-2xl" />
            </PopoverTrigger>
            <PopoverContent>
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col items-center gap-2 w-full"
              >
                <div className="w-full flex flex-col gap-2">
                  <h3 className="flex items-center justify-start gap-2 font-semibold">
                    <SortAscIcon /> Sort
                  </h3>
                  <hr />
                  <div className="flex items-center justify-start gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="created_date">
                          Created Date
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full flex items-center justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-800 text-white">
                    <SortAscIcon /> Sort
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <FilterIcon className="font-bold text-2xl" />
            </PopoverTrigger>
            <PopoverContent>
              <form
                onSubmit={handleFilterSubmit}
                className="flex flex-col items-center gap-2 w-full"
              >
                <div className="w-full flex flex-col gap-2">
                  <h3 className="flex items-center justify-start gap-2 font-semibold">
                    <FilterIcon /> Filter
                  </h3>
                  <hr />
                  <p className="font-semibold">Categories</p>
                  {options.map(({ label, value }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedOptions.includes(value)}
                        onCheckedChange={() =>
                          handleCheckboxChange(value)
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div className="w-full flex items-center justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-800 text-white">
                    <FilterIcon /> Filter
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover> */}
          
        </div>
        <div className="flex flex-col w-full">
          <div className="generalDorks p-2">
            <div className="flex items-center justify-start p-2 w-full">
              <h3 className="flex items-center gap-2 text-left font-bold tracking-tight text-xl text-cyan-600 w-full">
                <FolderOpen /> General Dorks
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 p-2 w-full">
              {filteredDorks.filter(dork => (dork.category === "General")).map((dork, index) => (
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
                            src={`/images/icons/${dork.icon ?? 'search.svg'}`} // Replace with your image
                            alt="dork-icon"
                            width={50}
                            height={50}
                            className="rounded-lg"
                          /> {dork.title}</CardTitle>
                      </CardHeader>
                      {/* <HeartIcon
                        onClick={() => toggleFavorite(dork.id)}
                        className={`${
                          dork.favorite ? "fill-red-600 text-red-700" : ""
                        } relative top-2 right-2`}
                      /> */}
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
                    {/* <div className="flex items-center text-xs text-gray-400 gap-1">
                      <Calendar />
                      <p>
                        {dork.createdAt
                          ? format(dork.createdAt, "dd/MM/yyyy")
                          : ""}
                      </p>
                    </div> */}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className="allDorks p-2">
            <div className="flex items-center justify-start p-2 w-full">
              <h3 className="flex items-center gap-2 text-left text-xl font-bold tracking-tight text-cyan-600 w-full">
                <FolderOpen /> Target Dorks
              </h3>

            </div>
            <div className="flex items-center justify-start gap-2 flex-1 w-full p-2">
              <div className="flex items-center justify-start gap-2 w-full">
                <span className="font-bold flex items-center gap-2">
                  <TargetIcon /> Target:{" "}
                </span>{" "}
                {!isUpdatingTarget && (
                  <div className="flex items-center gap-2">
                    <span id="currentTarget" className="text-orange-600">
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
              {filteredDorks.filter(dork => (dork.category !== "General")).map((dork, index) => (
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
                      {/* <HeartIcon
                        onClick={() => toggleFavorite(dork.id)}
                        className={`${
                          dork.favorite ? "fill-red-600 text-red-700" : ""
                        } relative top-2 right-2`}
                      /> */}
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
                    {/* <div className="flex items-center text-xs text-gray-400 gap-1">
                      <Calendar />
                      <p>
                        {dork.createdAt
                          ? format(dork.createdAt, "dd/MM/yyyy")
                          : ""}
                      </p>
                    </div> */}
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
