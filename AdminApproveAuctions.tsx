import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Eye,
  Clock,
  DollarSign,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import api from "@/services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

interface Auction {
  _id: string;
  title: string;
  description: string;
  images: string[];
  startPrice: number;
  currentPrice: number;
  minIncrement: number;
  startTime: string;
  endTime: string;
  status: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminApproveAuctions = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auctions");
      setAuctions(response.data.items || []);
    } catch (error) {
      toast.error("Không thể tải danh sách phiên đấu giá!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/auctions/${id}/approve`);
      toast.success("Đã duyệt phiên đấu giá!");
      fetchAuctions();
      setSelectedAuction(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể duyệt phiên đấu giá!");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/auctions/${id}/reject`);
      toast.success("Đã từ chối phiên đấu giá!");
      fetchAuctions();
      setSelectedAuction(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể từ chối phiên đấu giá!");
    }
  };

  const openDialog = (auction: Auction, type: "approve" | "reject") => {
    setSelectedAuction(auction);
    setActionType(type);
  };

  const filteredAuctions = auctions.filter((auction) => {
    if (activeTab === "pending") return auction.status === "PENDING";
    if (activeTab === "approved") return auction.status === "ACTIVE";
    if (activeTab === "rejected") return auction.status === "REJECTED";
    return true;
  });

  const stats = {
    pending: auctions.filter((a) => a.status === "PENDING").length,
    approved: auctions.filter((a) => a.status === "ACTIVE").length,
    rejected: auctions.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-card border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-xl font-bold">
                  Duyệt phiên đấu giá
                </h1>
                <p className="text-sm text-muted-foreground">
                  Quản lý và phê duyệt các phiên đấu giá
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="pending" className="gap-2">
                <AlertCircle className="w-4 h-4" />
                Chờ duyệt
                <Badge variant="secondary">{stats.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <Check className="w-4 h-4" />
                Đã duyệt
                <Badge variant="secondary">{stats.approved}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <X className="w-4 h-4" />
                Đã từ chối
                <Badge variant="secondary">{stats.rejected}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-muted-foreground">Đang tải...</p>
                </div>
              ) : filteredAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">
                    Không có phiên đấu giá nào
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === "pending" && "Chưa có phiên đấu giá nào chờ duyệt"}
                    {activeTab === "approved" && "Chưa có phiên đấu giá nào được duyệt"}
                    {activeTab === "rejected" && "Chưa có phiên đấu giá nào bị từ chối"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAuctions.map((auction, index) => (
                    <motion.div
                      key={auction._id}
                      custom={index}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="elevated-card rounded-2xl p-6"
                    >
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="w-48 h-48 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                          <img
                            src={auction.images?.[0] || "https://via.placeholder.com/400"}
                            alt={auction.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-display text-2xl font-bold">
                                {auction.title}
                              </h3>
                              {auction.status === "PENDING" && (
                                <Badge variant="secondary" className="bg-auction-gold/20 text-auction-gold">
                                  Chờ duyệt
                                </Badge>
                              )}
                              {auction.status === "ACTIVE" && (
                                <Badge className="bg-auction-success">Đã duyệt</Badge>
                              )}
                              {auction.status === "REJECTED" && (
                                <Badge variant="destructive">Đã từ chối</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground line-clamp-2">
                              {auction.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Giá khởi điểm</p>
                                <p className="font-semibold">
                                  {new Intl.NumberFormat("vi-VN").format(auction.startPrice)} ₫
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Người tạo</p>
                                <p className="font-semibold">{auction.createdBy?.name || "N/A"}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Bắt đầu</p>
                                <p className="font-semibold">
                                  {new Date(auction.startTime).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Kết thúc</p>
                                <p className="font-semibold">
                                  {new Date(auction.endTime).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => navigate(`/admin/auction-review/${auction._id}`)}
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </Button>

                            {auction.status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-2 bg-auction-success hover:bg-auction-success/90"
                                  onClick={() => openDialog(auction, "approve")}
                                >
                                  <Check className="w-4 h-4" />
                                  Duyệt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-2"
                                  onClick={() => openDialog(auction, "reject")}
                                >
                                  <X className="w-4 h-4" />
                                  Từ chối
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedAuction} onOpenChange={() => setSelectedAuction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Duyệt phiên đấu giá?" : "Từ chối phiên đấu giá?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? `Bạn có chắc muốn duyệt phiên đấu giá "${selectedAuction?.title}"? Phiên đấu giá sẽ được công khai và người dùng có thể tham gia đấu giá.`
                : `Bạn có chắc muốn từ chối phiên đấu giá "${selectedAuction?.title}"? Hành động này không thể hoàn tác.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedAuction) {
                  if (actionType === "approve") {
                    handleApprove(selectedAuction._id);
                  } else {
                    handleReject(selectedAuction._id);
                  }
                }
              }}
              className={actionType === "approve" ? "bg-auction-success" : "bg-destructive"}
            >
              {actionType === "approve" ? "Duyệt" : "Từ chối"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminApproveAuctions;
