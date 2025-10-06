import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Eye, 
  Building2,
  LocateIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useManageDeals } from "@/hooks/useManageDeals";
import DotLoader from "@/components/ui/loader";
import { ROUTES } from "@/config/routes";
import { DealModel } from "@/types/deal";

export default function ManageDeals() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    draftDeals, 
    loading, 
    error, 
  } = useManageDeals();

  // Filter deals based on search query
  const filteredDeals = draftDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleViewDeal = (deal: Partial<DealModel>) => {
    navigate(`/deals/${deal.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <DotLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Your Deals</h1>
                <p className="text-gray-600 mt-1">
                  View and manage your draft deals
                </p>
              </div>
              <Button 
                onClick={() => navigate(ROUTES.CREATE_DEAL)}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Create New Deal
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Deals</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredDeals.length} of {draftDeals.length} deals
              </div>
            </div>
          </div>

          {/* Deals Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Draft Deals</h2>
                {error && (
                  <Badge variant="destructive" className="text-xs">
                    Error loading deals
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-6">
              {filteredDeals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    {searchQuery ? (
                      <>
                        <p className="text-lg font-medium mb-2">No deals found</p>
                        <p className="text-sm">Try adjusting your search</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mb-2">No draft deals yet</p>
                        <p className="text-sm">Create your first deal to get started</p>
                      </>
                    )}
                  </div>
                  <Button onClick={() => navigate(ROUTES.CREATE_DEAL)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Deal
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Deal Title
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            Industry
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <LocateIcon className="w-4 h-4 text-gray-400" />
                            Location
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-right"><div className="flex items-center gap-2">
                            Actions
                          </div></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals.map((deal) => (
                        <TableRow key={deal.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <span className="truncate max-w-[200px] block">{deal.title}</span>
                          </TableCell>
                          <TableCell>
                            <span className="truncate max-w-[150px] block">{deal.industry}</span>
                          </TableCell>
                          <TableCell>
                            <span>{deal.location}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDeal(deal)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}