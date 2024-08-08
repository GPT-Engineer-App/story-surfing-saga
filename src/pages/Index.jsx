import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search } from 'lucide-react';

const fetchHNStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['hnStories'],
    queryFn: fetchHNStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Hacker News Top 100</h1>
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search stories..."
          className="pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading && (
        <div className="space-y-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-center">Error: {error.message}</p>}
      {!isLoading && !error && (
        <>
          <p className="text-center mb-4 text-gray-600">
            Showing {filteredStories.length} of {data.hits.length} stories
          </p>
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <div key={story.objectID} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                <p className="text-gray-600 mb-2">Upvotes: {story.points} | Author: {story.author}</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    Read More <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
