import { useState, useEffect, useRef } from "react";
import { Label } from "@/ui/shadCN/label";
import { Input } from "@/ui/shadCN/input";
import { Button } from "@/ui/shadCN/button";
import { MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CountrySelectorProps {
  value: string;
  onChange: (value: string, countryCode?: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

interface CountrySuggestion {
  id: string;
  name: string;
  countryCode: string;
  full_name: string;
}

export const CountrySelector = ({
  value,
  onChange,
  error,
  label = "Country",
  placeholder = "Search for a country",
}: CountrySelectorProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<CountrySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCountrySuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?types=country&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiZ29hbGdnOCIsImEiOiJjbWEwMzJjbm4wcDd4MmlzOHY2dWNqeDQyIn0.V2S6HnhBZYIb2YXjFptd3w"}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch country suggestions");
      }

      const data = await response.json();

      const formattedSuggestions = data.features.map(
        (feature: {
          id: string;
          text: string;
          properties: { short_code: string };
          place_name: string;
        }) => ({
          id: feature.id,
          name: feature.text,
          countryCode: feature.properties?.short_code?.toUpperCase() || "",
          full_name: feature.place_name,
        })
      );

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching country suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length >= 2) {
      fetchCountrySuggestions(query);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCountry = (suggestion: CountrySuggestion) => {
    setSearchTerm(suggestion.name);
    onChange(suggestion.name, suggestion.countryCode);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearInput = () => {
    setSearchTerm("");
    onChange("", "");
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="country">{t(label)}</Label>
      <div className="relative">
        <div className="flex items-center">
          <Input
            ref={inputRef}
            id="country"
            name="country"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              if (searchTerm.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            placeholder={t(placeholder)}
            className="text-black placeholder:text-gray-600 pr-10"
            autoComplete="off"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={clearInput}
            >
              <X size={18} />
            </Button>
          )}
        </div>
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100 text-gray-800"
                  onClick={() => handleSelectCountry(suggestion)}
                >
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  <div>
                    <div>{suggestion.name}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.full_name}
                    </div>
                  </div>
                </div>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="px-4 py-2 text-gray-500">No results found</div>
            ) : null}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CountrySelector;
