import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users, Building2, TrendingUp, MessageSquare,
  Plus, Edit3, Trash2, Shield, ArrowLeft,
  LayoutDashboard, Home as HomeIcon, UserCog, Mail,
  ClipboardList, Package, CheckCircle2, Clock, MapPin, TrendingUp as TrendingUpIcon,
  Upload, XCircle, Eye, X, Maximize2, Phone, Globe,
} from "lucide-react";

type Tab = "dashboard" | "properties" | "users" | "leads" | "vgr-pipeline" | "supplier-products" | "vendor-submissions";

export default function Admin() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user as any).role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center">
          <Shield size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl mb-4">{t.admin.accessDenied}</h1>
          <p className="text-[#8a8580] mb-8">{t.admin.accessDeniedDesc}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: t.admin.dashboard, icon: <LayoutDashboard size={16} /> },
    { id: "vgr-pipeline", label: "VGR Pipeline", icon: <ClipboardList size={16} /> },
    { id: "supplier-products", label: "Supplier Products", icon: <Package size={16} /> },
    { id: "vendor-submissions", label: "Vendor Submissions", icon: <Upload size={16} /> },
    { id: "properties", label: t.admin.propertyManagement, icon: <HomeIcon size={16} /> },
    { id: "users", label: t.admin.userManagement, icon: <UserCog size={16} /> },
    { id: "leads", label: t.admin.leadManagement, icon: <Mail size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-2">{t.admin.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#c5a059] text-black"
                  : "bg-white/5 text-[#8a8580] hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "vgr-pipeline" && <AdminVgrPipelineTab />}
        {activeTab === "supplier-products" && <AdminSupplierProductsTab />}
        {activeTab === "vendor-submissions" && <VendorSubmissionsTab />}
        {activeTab === "properties" && <PropertiesTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "leads" && <LeadsTab />}
      </div>
      <Footer />
    </div>
  );
}

/* ========== DASHBOARD TAB ========== */
function DashboardTab() {
  const { t } = useTranslation();
  const { data, isLoading } = trpc.admin.dashboard.useQuery();

  if (isLoading) return <LoadingSpinner />;

  const stats = data?.stats;
  const recentLeads = data?.recentLeads || [];

  const statCards = [
    { label: t.admin.totalUsers, value: stats?.totalUsers ?? 0, icon: <Users size={20} />, color: "text-blue-400" },
    { label: t.admin.premiumUsers, value: stats?.premiumUsers ?? 0, icon: <TrendingUp size={20} />, color: "text-[#c5a059]" },
    { label: t.admin.vipUsers, value: stats?.vipUsers ?? 0, icon: <Shield size={20} />, color: "text-[#ffd700]" },
    { label: t.admin.totalProperties, value: stats?.totalProperties ?? 0, icon: <Building2 size={20} />, color: "text-green-400" },
    { label: t.admin.totalLeads, value: stats?.totalLeads ?? 0, icon: <MessageSquare size={20} />, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <div className="font-display font-bold text-2xl mb-1">{stat.value}</div>
            <div className="text-xs text-[#6b6560] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="font-display font-semibold text-lg mb-4">{t.admin.recentLeads}</h3>
        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadName}</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadEmail}</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadBudget}</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadSector}</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadDate}</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="border-b border-white/5">
                    <td className="py-3">{lead.fullName}</td>
                    <td className="py-3 text-[#8a8580]">{lead.email}</td>
                    <td className="py-3 text-[#c5a059]">{lead.budget}</td>
                    <td className="py-3">{lead.sector || "—"}</td>
                    <td className="py-3 text-[#6b6560]">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#6b6560] text-sm">{t.admin.noData}</p>
        )}
      </div>
    </div>
  );
}

/* ========== PROPERTIES TAB ========== */
function PropertiesTab() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: properties, isLoading } = trpc.admin.properties.list.useQuery();

  const createProp = trpc.admin.properties.create.useMutation({
    onSuccess: () => {
      toast.success("Property created");
      utils.admin.properties.list.invalidate();
      setShowForm(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateProp = trpc.admin.properties.update.useMutation({
    onSuccess: () => {
      toast.success("Property updated");
      utils.admin.properties.list.invalidate();
      setEditingId(null);
      setShowForm(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteProp = trpc.admin.properties.delete.useMutation({
    onSuccess: () => {
      toast.success("Property deleted");
      utils.admin.properties.list.invalidate();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleDelete = (id: number) => {
    if (confirm(t.admin.deleteConfirm)) {
      deleteProp.mutate({ id });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (showForm) {
    return (
      <PropertyForm
        editingId={editingId}
        properties={properties || []}
        onSubmit={(data: any) => {
          if (editingId) {
            updateProp.mutate({ id: editingId, ...data });
          } else {
            createProp.mutate(data);
          }
        }}
        onCancel={() => { setShowForm(false); setEditingId(null); }}
        isPending={createProp.isPending || updateProp.isPending}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">{t.admin.propertyManagement}</h3>
        <button
          onClick={() => { setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-all"
        >
          <Plus size={14} />
          {t.admin.addProperty}
        </button>
      </div>
      {properties && properties.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.propertyTitle}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.propertyType}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.propertyRegion}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.propertyPrice}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.propertyStatus}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4 capitalize text-[#8a8580]">{p.type}</td>
                  <td className="p-4 text-[#8a8580]">{p.region}</td>
                  <td className="p-4 text-[#c5a059]">${p.priceUSD?.toLocaleString()}{p.listingType === "rent" ? "/mo" : ""}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-mono ${
                      p.status === "active" ? "bg-green-500/10 text-green-400" :
                      p.status === "inactive" ? "bg-red-500/10 text-red-400" :
                      "bg-yellow-500/10 text-yellow-400"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingId(p.id); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-white/10 text-[#c5a059]">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <Building2 size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">{t.admin.noData}</p>
        </div>
      )}
    </div>
  );
}

/* ========== PROPERTY FORM ========== */
function PropertyForm({ editingId, properties, onSubmit, onCancel, isPending }: {
  editingId: number | null;
  properties: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const { t } = useTranslation();
  const existing = editingId ? properties.find((p: any) => p.id === editingId) : null;

  const [form, setForm] = useState({
    title: existing?.title || "",
    description: existing?.description || "",
    type: existing?.type || "villa",
    region: existing?.region || "Canggu",
    priceUSD: existing?.priceUSD?.toString() || "",
    priceIDR: existing?.priceIDR?.toString() || "",
    area: existing?.area?.toString() || "",
    bedrooms: existing?.bedrooms?.toString() || "",
    bathrooms: existing?.bathrooms?.toString() || "",
    listingType: existing?.listingType || "rent",
    status: existing?.status || "active",
    image: existing?.image || "",
    features: existing?.features || "",
    lat: existing?.lat?.toString() || "",
    lng: existing?.lng?.toString() || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceUSD = parseFloat(form.priceUSD) || 0;
    onSubmit({
      title: form.title,
      description: form.description,
      type: form.type,
      region: form.region,
      priceUSD,
      priceIDR: parseFloat(form.priceIDR) || Math.round(priceUSD * 15800),
      area: parseFloat(form.area) || 0,
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      listingType: form.listingType,
      status: form.status,
      image: form.image,
      features: form.features,
      lat: form.lat || undefined,
      lng: form.lng || undefined,
    });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 placeholder:text-[#6b6560]";
  const labelClass = "block text-xs text-[#6b6560] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-4">
      <button onClick={onCancel} className="flex items-center gap-2 text-sm text-[#8a8580] hover:text-white transition-colors">
        <ArrowLeft size={14} /> {t.admin.back}
      </button>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
        <h3 className="font-display font-semibold text-lg mb-6">
          {editingId ? t.admin.editProperty : t.admin.addProperty}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.admin.propertyTitle}</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyType}</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyRegion}</label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputClass}>
                {["Canggu", "Seminyak", "Ubud", "Uluwatu", "Nusa Dua", "Sanur", "Denpasar", "Kuta"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyPrice} (USD)</label>
              <input type="number" value={form.priceUSD} onChange={(e) => setForm({ ...form, priceUSD: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Price (IDR)</label>
              <input type="number" value={form.priceIDR} onChange={(e) => setForm({ ...form, priceIDR: e.target.value })} className={inputClass} placeholder="Auto-calculated if empty" />
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyArea}</label>
              <input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyBedrooms}</label>
              <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyBathrooms}</label>
              <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyListingType}</label>
              <select value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })} className={inputClass}>
                <option value="rent">{t.admin.rent}</option>
                <option value="sale">{t.admin.sale}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.admin.propertyStatus}</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="active">{t.admin.active}</option>
                <option value="inactive">{t.admin.inactive}</option>
                <option value="draft">{t.admin.draft}</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>{t.admin.propertyImage}</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.admin.propertyDescription}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} h-24 resize-none`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className={inputClass} placeholder="-8.65" />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className={inputClass} placeholder="115.13" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c5a059] text-black font-display font-semibold text-sm hover:bg-[#d4b06a] transition-all disabled:opacity-50">
              {editingId ? t.admin.save : t.admin.create}
            </button>
            <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl bg-white/5 text-[#8a8580] font-display font-semibold text-sm hover:bg-white/10 transition-all">
              {t.admin.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========== USERS TAB ========== */
function UsersTab() {
  const { t } = useTranslation();
  const { data: users, isLoading } = trpc.admin.users.list.useQuery();
  const utils = trpc.useUtils();

  const changeTier = trpc.admin.users.updateTier.useMutation({
    onSuccess: () => {
      toast.success("User tier updated");
      utils.admin.users.list.invalidate();
      utils.admin.dashboard.invalidate();
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="font-display font-semibold text-lg">{t.admin.userManagement}</h3>
      {users && users.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.userName}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.userEmail}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.userTier}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.userRole}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.userJoined}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-medium">{u.name || "—"}</td>
                  <td className="p-4 text-[#8a8580]">{u.email || "—"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-mono ${
                      u.subscriptionTier === "vip" ? "bg-[#ffd700]/10 text-[#ffd700]" :
                      u.subscriptionTier === "premium" ? "bg-[#c5a059]/10 text-[#c5a059]" :
                      "bg-white/5 text-[#8a8580]"
                    }`}>{u.subscriptionTier}</span>
                  </td>
                  <td className="p-4 capitalize text-[#8a8580]">{u.role}</td>
                  <td className="p-4 text-[#6b6560]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select
                      value={u.subscriptionTier}
                      onChange={(e) => changeTier.mutate({ userId: u.id, tier: e.target.value as any })}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#c5a059]/50"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <Users size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">{t.admin.noData}</p>
        </div>
      )}
    </div>
  );
}

/* ========== LEADS TAB ========== */
function LeadsTab() {
  const { t } = useTranslation();
  const utils = trpc.useUtils();
  const { data: leads, isLoading, error } = trpc.admin.leads.list.useQuery();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const updateStatusMutation = trpc.admin.leads.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.leads.list.invalidate();
      utils.admin.dashboard.invalidate();
      toast.success("Lead status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
      <MessageSquare size={32} className="text-red-400 mx-auto mb-3" />
      <p className="text-red-400 font-medium mb-1">Failed to load leads</p>
      <p className="text-[#6b6560] text-sm">{error.message}</p>
    </div>
  );

  const filteredLeads = (leads || []).filter((lead: any) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch = searchTerm === "" ||
      lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = (leads || []).reduce((acc: Record<string, number>, lead: any) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    qualified: "bg-green-500/10 text-green-400 border-green-500/20",
    lost: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="font-display font-semibold text-lg">
          {t.admin.leadManagement}
          <span className="ml-2 text-sm text-[#6b6560] font-normal">({leads?.length || 0} total)</span>
        </h3>
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#6b6560] focus:outline-none focus:border-[#c5a059]/40 w-full sm:w-64"
        />
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            statusFilter === "all" ? "bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/30" : "bg-white/5 text-[#8a8580] border-white/10 hover:bg-white/10"
          }`}
        >
          All ({leads?.length || 0})
        </button>
        {["new", "contacted", "qualified", "lost"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              statusFilter === s ? statusColors[s] : "bg-white/5 text-[#8a8580] border-white/10 hover:bg-white/10"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      {filteredLeads.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadName}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadEmail}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Phone</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadBudget}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadSector}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadSource}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadDate}</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">{t.admin.leadStatus}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-medium">{lead.fullName}</td>
                  <td className="p-4 text-[#8a8580]">{lead.email}</td>
                  <td className="p-4 text-[#8a8580]">{lead.phone || "\u2014"}</td>
                  <td className="p-4 text-[#c5a059]">{lead.budget || "\u2014"}</td>
                  <td className="p-4">{lead.sector || "\u2014"}</td>
                  <td className="p-4 text-[#8a8580]">{lead.source || "\u2014"}</td>
                  <td className="p-4 text-[#6b6560]">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: lead.id, status: e.target.value as any })}
                      disabled={updateStatusMutation.isPending}
                      className={`px-2 py-1 rounded-lg text-xs font-mono border bg-transparent cursor-pointer focus:outline-none ${
                        statusColors[lead.status] || "bg-white/5 text-[#8a8580] border-white/10"
                      }`}
                    >
                      <option value="new" className="bg-[#1a1a1b] text-white">New</option>
                      <option value="contacted" className="bg-[#1a1a1b] text-white">Contacted</option>
                      <option value="qualified" className="bg-[#1a1a1b] text-white">Qualified</option>
                      <option value="lost" className="bg-[#1a1a1b] text-white">Lost</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <MessageSquare size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">{searchTerm || statusFilter !== "all" ? "No leads match your filters" : t.admin.noData}</p>
        </div>
      )}
    </div>
  );
}

/* ========== ADMIN VGR PIPELINE TAB ========== */
function AdminVgrPipelineTab() {
  const { data: pipelineData, isLoading: pipelineLoading } = trpc.partner.getVgrPipelineSummary.useQuery();
  const { data: leadsData, isLoading: leadsLoading } = trpc.partner.getVgrLeads.useQuery();

  if (pipelineLoading || leadsLoading) return <LoadingSpinner />;

  const summary = pipelineData?.summary || [];
  const leads = leadsData?.leads || [];
  const totalLeads = summary.reduce((acc: number, s: { count: number }) => acc + s.count, 0);
  const wonLeads = summary.filter((s: { isWon: boolean }) => s.isWon).reduce((acc: number, s: { count: number }) => acc + s.count, 0);

  return (
    <div className="space-y-6">
      <h3 className="font-display font-semibold text-lg">VGR Operations Pipeline Summary</h3>

      {/* Pipeline Stage Bars */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#8a8580]">Total: {totalLeads} leads</span>
          <span className="text-sm text-green-400">Completed: {wonLeads}</span>
        </div>
        {summary.length > 0 ? (
          <div className="space-y-3">
            {summary.map((stage: { stageId: number; stageName: string; count: number; isWon: boolean }) => (
              <div key={stage.stageId} className="flex items-center gap-4">
                <div className="w-40 flex items-center gap-2">
                  {stage.isWon ? (
                    <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                  ) : (
                    <Clock size={14} className="text-[#c5a059] shrink-0" />
                  )}
                  <span className="text-sm truncate">{stage.stageName}</span>
                </div>
                <div className="flex-1 bg-white/5 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${stage.isWon ? "bg-green-500" : "bg-[#c5a059]"}`}
                    style={{ width: `${totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-[#c5a059] w-8 text-right">{stage.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6b6560] text-sm">No pipeline data</p>
        )}
      </div>

      {/* Recent VGR Leads */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="font-display font-semibold text-lg mb-4">Recent VGR Leads</h3>
        {leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Name</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Email</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Stage</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Investment</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Contract</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Company</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 20).map((lead: { id: number; partner_name: string | null; name: string | null; email_from: string | null; stage_id: [number, string] | false; x_investment_amount: number | null; x_contract_status: string | false | null; x_company_name_custom: string | false | null }) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3">{lead.partner_name || lead.name || "\u2014"}</td>
                    <td className="py-3 text-[#8a8580]">{lead.email_from || "\u2014"}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-lg bg-[#c5a059]/10 text-[#c5a059]">
                        {Array.isArray(lead.stage_id) ? lead.stage_id[1] : "\u2014"}
                      </span>
                    </td>
                    <td className="py-3 text-[#c5a059]">
                      {lead.x_investment_amount ? `$${lead.x_investment_amount.toLocaleString()}` : "\u2014"}
                    </td>
                    <td className="py-3">
                      {lead.x_contract_status && typeof lead.x_contract_status === "string" ? lead.x_contract_status : "\u2014"}
                    </td>
                    <td className="py-3 text-[#8a8580]">
                      {lead.x_company_name_custom && typeof lead.x_company_name_custom === "string" ? lead.x_company_name_custom : "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#6b6560] text-sm">No VGR leads found</p>
        )}
      </div>
    </div>
  );
}

/* ========== ADMIN SUPPLIER PRODUCTS TAB ========== */
function AdminSupplierProductsTab() {
  const { data, isLoading } = trpc.partner.getSupplierProducts.useQuery();

  if (isLoading) return <LoadingSpinner />;

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">Supplier Real Estate Products (Odoo)</h3>
        <span className="text-xs text-[#6b6560] font-mono">{products.length} products</span>
      </div>

      {products.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Name</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Price (USD)</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">ROI %</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Total Units</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Available</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Location</th>
                <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Docs</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: { id: number; name: string; list_price: number; x_projected_roi?: number; x_total_units?: number; x_available_units?: number; x_location_lat?: number; x_location_long?: number; x_documents_link?: string | false | null; active?: boolean }) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-[#c5a059]">${p.list_price.toLocaleString()}</td>
                  <td className="p-4">{p.x_projected_roi ? `${p.x_projected_roi}%` : "\u2014"}</td>
                  <td className="p-4">{p.x_total_units ?? "\u2014"}</td>
                  <td className="p-4">{p.x_available_units ?? "\u2014"}</td>
                  <td className="p-4 text-[#8a8580]">
                    {p.x_location_lat && p.x_location_long
                      ? `${p.x_location_lat.toFixed(3)}, ${p.x_location_long.toFixed(3)}`
                      : "\u2014"}
                  </td>
                  <td className="p-4">
                    {p.x_documents_link && typeof p.x_documents_link === "string" ? (
                      <a href={p.x_documents_link} target="_blank" rel="noopener noreferrer" className="text-[#c5a059] hover:underline text-xs">View</a>
                    ) : "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <Package size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">No supplier products found in Odoo</p>
        </div>
      )}
    </div>
  );
}

/* ========== VENDOR SUBMISSIONS TAB ========== */
function VendorSubmissionsTab() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.vendors.list.useQuery();
  const updateStatus = trpc.admin.vendors.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.vendors.list.invalidate();
      toast.success("Submission status updated");
    },
  });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) return <LoadingSpinner />;

  const submissions = (data || []) as Array<{
    id: number;
    title: string;
    type: string;
    region: string;
    priceUSD: number;
    area: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string | null;
    contactCountry?: string | null;
    status: string;
    imageUrls?: string | null;
    odooProductId?: number | null;
    createdAt?: string | Date | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    livingRooms?: number | null;
    kitchens?: number | null;
    description?: string | null;
  }>;

  const pending = submissions.filter((s) => s.status === "pending");
  const approved = submissions.filter((s) => s.status === "approved");
  const rejected = submissions.filter((s) => s.status === "rejected");

  const parseImages = (imageUrls?: string | null): string[] => {
    if (!imageUrls) return [];
    return imageUrls.split("\n").filter(Boolean);
  };

  const ImageGallery = ({ images, size = "sm" }: { images: string[]; size?: "sm" | "lg" }) => {
    if (images.length === 0) return <span className="text-[#4a4540] text-xs italic">No images</span>;
    const thumbClass = size === "lg" ? "w-24 h-18" : "w-16 h-12";
    return (
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setLightboxImage(url); }}
            className={`${thumbClass} relative group rounded-lg overflow-hidden border border-white/10 hover:border-[#c5a059]/40 transition-all cursor-pointer`}
          >
            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <Maximize2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
        {images.length > 0 && (
          <span className="text-[10px] text-[#6b6560] font-mono self-end">{images.length} photo{images.length > 1 ? "s" : ""}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxImage}
            alt="Full size preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">Vendor Submissions</h3>
        <div className="flex gap-3 text-xs font-mono">
          <span className="text-yellow-400">{pending.length} pending</span>
          <span className="text-green-400">{approved.length} approved</span>
          <span className="text-red-400">{rejected.length} rejected</span>
        </div>
      </div>

      {/* Pending Submissions - Detailed Cards */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-mono text-yellow-400 uppercase tracking-wider">Pending Approval</h4>
          {pending.map((s) => {
            const images = parseImages(s.imageUrls);
            return (
              <div key={s.id} className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <div className="flex flex-col gap-4">
                  {/* Header row */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="font-display font-semibold text-base mb-2">{s.title}</h5>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8a8580] mb-3">
                        <span className="inline-flex items-center gap-1"><Building2 size={12} /> {s.type}</span>
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {s.region}</span>
                        <span className="text-[#c5a059] font-semibold">${s.priceUSD.toLocaleString()}</span>
                        <span>{s.area}m²</span>
                      </div>
                      {/* Room details */}
                      <div className="flex flex-wrap gap-3 text-xs text-[#a09a94] mb-3">
                        {s.bedrooms != null && <span>{s.bedrooms} Bed</span>}
                        {s.bathrooms != null && <span>{s.bathrooms} Bath</span>}
                        {s.livingRooms != null && <span>{s.livingRooms} Living</span>}
                        {s.kitchens != null && <span>{s.kitchens} Kitchen</span>}
                      </div>
                      {/* Contact info */}
                      <div className="flex flex-wrap gap-3 text-xs text-[#8a8580]">
                        <span className="inline-flex items-center gap-1"><Mail size={12} /> {s.contactName} &middot; {s.contactEmail}</span>
                        {s.contactPhone && <span className="inline-flex items-center gap-1"><Phone size={12} /> {s.contactPhone}</span>}
                        {s.contactCountry && <span className="inline-flex items-center gap-1"><Globe size={12} /> {s.contactCountry}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateStatus.mutate({ id: s.id, status: "approved", odooProductId: s.odooProductId ?? undefined })}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-semibold hover:bg-green-500/30 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus.mutate({ id: s.id, status: "rejected", odooProductId: s.odooProductId ?? undefined })}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {images.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono text-[#6b6560] uppercase tracking-wider mb-2">Uploaded Images</p>
                      <ImageGallery images={images} size="lg" />
                    </div>
                  )}

                  {/* Description */}
                  {s.description && (
                    <div className="text-xs text-[#8a8580] bg-black/20 rounded-xl p-3 leading-relaxed">
                      {s.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All Submissions Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Images</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Title</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Type</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Region</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Price</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Contact</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Status</th>
              <th className="text-left p-4 text-[#6b6560] font-mono text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => {
              const images = parseImages(s.imageUrls);
              const isExpanded = expandedId === s.id;
              return (
                <>
                  <tr
                    key={s.id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] cursor-pointer ${
                      isExpanded ? "bg-white/[0.03]" : ""
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    <td className="p-4">
                      {images.length > 0 ? (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setLightboxImage(images[0]); }}
                            className="w-12 h-9 rounded-lg overflow-hidden border border-white/10 hover:border-[#c5a059]/40 transition-all relative group"
                          >
                            <img src={images[0]} alt="" className="w-full h-full object-cover" />
                            {images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/70 text-[8px] text-white px-1 rounded-tl">
                                +{images.length - 1}
                              </span>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#4a4540] text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4 font-medium">{s.title}</td>
                    <td className="p-4 text-[#8a8580]">{s.type}</td>
                    <td className="p-4 text-[#8a8580]">{s.region}</td>
                    <td className="p-4 text-[#c5a059]">${s.priceUSD.toLocaleString()}</td>
                    <td className="p-4 text-[#8a8580] text-xs">{s.contactName}<br/>{s.contactEmail}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${
                        s.status === "approved" ? "bg-green-500/20 text-green-400" :
                        s.status === "rejected" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>{s.status}</span>
                    </td>
                    <td className="p-4">
                      {s.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: s.id, status: "approved", odooProductId: s.odooProductId ?? undefined }); }}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: s.id, status: "rejected", odooProductId: s.odooProductId ?? undefined }); }}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {/* Expanded row with full image gallery */}
                  {isExpanded && (
                    <tr key={`${s.id}-expanded`} className="border-b border-white/5 bg-white/[0.02]">
                      <td colSpan={8} className="p-4">
                        <div className="space-y-3">
                          {images.length > 0 && (
                            <div>
                              <p className="text-[10px] font-mono text-[#6b6560] uppercase tracking-wider mb-2">All Images ({images.length})</p>
                              <ImageGallery images={images} size="lg" />
                            </div>
                          )}
                          {s.description && (
                            <div>
                              <p className="text-[10px] font-mono text-[#6b6560] uppercase tracking-wider mb-1">Description</p>
                              <p className="text-xs text-[#a09a94] leading-relaxed">{s.description}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 text-xs text-[#8a8580]">
                            {s.bedrooms != null && <span>{s.bedrooms} Bedrooms</span>}
                            {s.bathrooms != null && <span>{s.bathrooms} Bathrooms</span>}
                            {s.livingRooms != null && <span>{s.livingRooms} Living Rooms</span>}
                            {s.kitchens != null && <span>{s.kitchens} Kitchens</span>}
                            <span>{s.area}m²</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {submissions.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <Upload size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">No vendor submissions yet</p>
        </div>
      )}
    </div>
  );
}

/* ========== LOADING SPINNER ========== */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
