import { useState, useEffect, useRef } from "react";
import { Label } from "@/ui/shadCN/label";
import { Input } from "@/ui/shadCN/input";
import { Button } from "@/ui/shadCN/button";
import { MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface CitySuggestion {
  id: string;
  name: string;
  full_name: string;
  context?: string;
}

export const CitySelector = ({
  value,
  onChange,
  countryCode,
  error,
  label = "City",
  placeholder = "Search for a city",
  disabled = false,
}: CitySelectorProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCitySuggestions = async (query: string) => {
    if (!query || query.length < 2 || !countryCode) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Constructing query parameters
      const params = new URLSearchParams({
        access_token:
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
          "pk.eyJ1IjoiZ29hbGdnOCIsImEiOiJjbWEwMzJjbm4wcDd4MmlzOHY2dWNqeDQyIn0.V2S6HnhBZYIb2YXjFptd3w",
        types: "place",
        country: countryCode.toLowerCase(),
      });

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch city suggestions");
      }

      const data = await response.json();

      const formattedSuggestions = data.features.map(
        (feature: {
          id: string;
          text: string;
          place_name: string;
          context: { id: string; text: string }[];
        }) => ({
          id: feature.id,
          name: feature.text,
          full_name: feature.place_name,
          context:
            feature.context?.find((c: { id: string; text: string }) =>
              c.id.startsWith("region")
            )?.text || "",
        })
      );

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length >= 2 && countryCode) {
      fetchCitySuggestions(query);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (suggestion: CitySuggestion) => {
    setSearchTerm(suggestion.name);
    onChange(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearInput = () => {
    setSearchTerm("");
    onChange("");
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

  // Clear city when country changes
  useEffect(() => {
    if (countryCode && searchTerm) {
      // Only clear if we have a country code and search term
      // This prevents clearing on initial load
      setSearchTerm("");
      onChange("");
    }
  }, [countryCode]);

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="city">{t(label)}</Label>
      <div className="relative">
        <div className="flex items-center">
          <Input
            ref={inputRef}
            id="city"
            name="city"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              if (searchTerm.length >= 2 && countryCode) {
                setShowSuggestions(true);
              }
            }}
            placeholder={
              !countryCode ? t("Please select a country first") : t(placeholder)
            }
            className="text-black placeholder:text-gray-600 pr-10"
            disabled={disabled || !countryCode}
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
                  onClick={() => handleSelectCity(suggestion)}
                >
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  <div>
                    <div>{suggestion.name}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.context ? `${suggestion.context}, ` : ""}
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

export default CitySelector;
