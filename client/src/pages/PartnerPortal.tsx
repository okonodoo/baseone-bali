import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2, ExternalLink, Shield, ChevronRight,
  Building2, FileText, Receipt, BarChart3,
  Package, MapPin, TrendingUp, Users2,
  ClipboardList, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";

// ==================== Types ====================

interface VgrLead {
  id: number;
  name: string | null;
  partner_name: string | null;
  email_from: string | null;
  phone: string | null;
  stage_id: [number, string] | false;
  team_id: [number, string] | false;
  expected_revenue: number | null;
  x_contract_status: string | false | null;
  x_company_name_custom: string | false | null;
  x_investment_amount: number | null;
  create_date: string | null;
  write_date: string | null;
}

interface SupplierProduct {
  id: number;
  name: string;
  list_price: number;
  categ_id: [number, string] | false;
  x_is_real_estate?: boolean;
  x_location_lat?: number;
  x_location_long?: number;
  x_projected_roi?: number;
  x_total_units?: number;
  x_available_units?: number;
  x_documents_link?: string | false | null;
  active?: boolean;
  description_sale?: string | false | null;
}

interface OdooTask {
  id: number;
  name: string;
  stage_id: [number, string] | false;
  x_portal_status_percentage?: number;
  date_deadline?: string | false | null;
  description?: string | false | null;
}

type PortalTab = "overview" | "vgr-pipeline" | "supplier-products" | "tasks";

export default function PartnerPortal() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center">
          <Shield size={48} className="text-[#c5a059] mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl mb-4">Partner Portal</h1>
          <p className="text-[#8a8580] mb-8">
            Partner portalına erişmek için lütfen giriş yapınız.
          </p>
          <a
            href="https://pt-telkon-one-group.odoo.com/my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a059] text-black font-display font-semibold hover:bg-[#d4b06a] transition-all"
          >
            Odoo Portal'a Git
            <ExternalLink size={16} />
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs: { id: PortalTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={16} /> },
    { id: "vgr-pipeline", label: "VGR Pipeline", icon: <ClipboardList size={16} /> },
    { id: "supplier-products", label: "Supplier Products", icon: <Package size={16} /> },
    { id: "tasks", label: "My Tasks", icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-2">
            Partner Portal
          </h1>
          <p className="text-[#8a8580]">
            Welcome, <span className="text-[#c5a059] font-semibold">{user?.name}</span>
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <QuickLinkCard
            icon={<Building2 size={20} />}
            title="Odoo Portal"
            desc="Odoo portal'ında tüm detayları görüntüleyin"
            url="https://pt-telkon-one-group.odoo.com/my"
          />
          <QuickLinkCard
            icon={<FileText size={20} />}
            title="Documents"
            desc="Proje belgelerinize erişin"
            url="https://pt-telkon-one-group.odoo.com/my/documents"
          />
          <QuickLinkCard
            icon={<Receipt size={20} />}
            title="Invoices"
            desc="Fatura ve ödeme detaylarını kontrol edin"
            url="https://pt-telkon-one-group.odoo.com/my/invoices"
          />
        </div>

        {/* Tabs */}
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

        {/* Tab Content */}
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "vgr-pipeline" && <VgrPipelineTab />}
        {activeTab === "supplier-products" && <SupplierProductsTab />}
        {activeTab === "tasks" && <TasksTab />}
      </div>
      <Footer />
    </div>
  );
}

/* ========== QUICK LINK CARD ========== */
function QuickLinkCard({ icon, title, desc, url }: { icon: React.ReactNode; title: string; desc: string; url: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-[#c5a059]/20 transition-all">
      <div className="text-[#c5a059] mb-3">{icon}</div>
      <h3 className="font-display font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-[#6b6560] mb-4">{desc}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[#c5a059] font-medium hover:underline"
      >
        Open <ExternalLink size={12} />
      </a>
    </div>
  );
}

/* ========== OVERVIEW TAB ========== */
function OverviewTab() {
  const { data: pipelineData, isLoading: pipelineLoading } = trpc.partner.getVgrPipelineSummary.useQuery();
  const { data: productsData, isLoading: productsLoading } = trpc.partner.getSupplierProducts.useQuery();

  if (pipelineLoading || productsLoading) return <LoadingSpinner />;

  const summary = pipelineData?.summary || [];
  const totalLeads = summary.reduce((acc, s) => acc + s.count, 0);
  const wonLeads = summary.filter(s => s.isWon).reduce((acc, s) => acc + s.count, 0);
  const products = productsData?.products || [];
  const totalProducts = products.length;
  const totalUnits = products.reduce((acc: number, p: SupplierProduct) => acc + (p.x_total_units || 0), 0);
  const availableUnits = products.reduce((acc: number, p: SupplierProduct) => acc + (p.x_available_units || 0), 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<ClipboardList size={20} />} label="VGR Pipeline Leads" value={totalLeads} color="text-blue-400" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed" value={wonLeads} color="text-green-400" />
        <StatCard icon={<Package size={20} />} label="RE Products" value={totalProducts} color="text-[#c5a059]" />
        <StatCard icon={<Users2 size={20} />} label="Available Units" value={availableUnits} color="text-purple-400" />
      </div>

      {/* VGR Pipeline Mini */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <ClipboardList size={18} className="text-[#c5a059]" />
          VGR Operations Pipeline
        </h3>
        {summary.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {summary.map((stage) => (
              <div
                key={stage.stageId}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
                  stage.isWon
                    ? "border-green-500/20 bg-green-500/5"
                    : stage.count > 0
                    ? "border-[#c5a059]/20 bg-[#c5a059]/5"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <span className="font-display font-bold text-lg">{stage.count}</span>
                <span className="text-xs text-[#8a8580]">{stage.stageName}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6b6560] text-sm">No pipeline data available</p>
        )}
      </div>

      {/* Supplier Products Mini */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <Package size={18} className="text-[#c5a059]" />
          Supplier Products Summary
        </h3>
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Name</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Price (USD)</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">ROI %</th>
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Units</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p: SupplierProduct) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="py-3">{p.name}</td>
                    <td className="py-3 text-[#c5a059]">${p.list_price.toLocaleString()}</td>
                    <td className="py-3">{p.x_projected_roi ? `${p.x_projected_roi}%` : "—"}</td>
                    <td className="py-3">{p.x_available_units ?? "—"} / {p.x_total_units ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#6b6560] text-sm">No products found</p>
        )}
      </div>
    </div>
  );
}

/* ========== VGR PIPELINE TAB ========== */
function VgrPipelineTab() {
  const { data: stagesData, isLoading: stagesLoading } = trpc.partner.getVgrStages.useQuery();
  const { data: leadsData, isLoading: leadsLoading } = trpc.partner.getVgrLeads.useQuery();

  if (stagesLoading || leadsLoading) return <LoadingSpinner />;

  const stages = stagesData?.stages || [];
  const leads = leadsData?.leads || [];

  // Group leads by stage
  const leadsByStage = new Map<number, typeof leads>();
  for (const lead of leads) {
    const stageId = Array.isArray(lead.stage_id) ? lead.stage_id[0] : 0;
    if (!leadsByStage.has(stageId)) leadsByStage.set(stageId, []);
    leadsByStage.get(stageId)!.push(lead);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl">VGR Operations CRM Pipeline</h2>
        <span className="text-xs text-[#6b6560] font-mono">{leads.length} total leads</span>
      </div>

      {/* Kanban-style pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage: { id: number; name: string; sequence: number; team_ids: number[]; is_won: boolean }) => {
            const stageLeads = leadsByStage.get(stage.id) || [];
            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                {/* Stage Header */}
                <div className={`px-4 py-3 border-b border-white/5 flex items-center justify-between ${
                  stage.is_won ? "bg-green-500/5" : ""
                }`}>
                  <div className="flex items-center gap-2">
                    {stage.is_won ? (
                      <CheckCircle2 size={14} className="text-green-400" />
                    ) : (
                      <Clock size={14} className="text-[#c5a059]" />
                    )}
                    <span className="font-display font-semibold text-sm">{stage.name}</span>
                  </div>
                  <span className="text-xs font-mono text-[#6b6560] bg-white/5 px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lead Cards */}
                <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
                  {stageLeads.length === 0 ? (
                    <p className="text-xs text-[#6b6560] text-center py-4">No leads</p>
                  ) : (
                    stageLeads.map((lead: VgrLead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-white/5 bg-white/[0.03] p-3 hover:border-[#c5a059]/20 transition-all"
                      >
                        <p className="font-display font-medium text-sm mb-1 truncate">
                          {lead.partner_name || lead.name || "Unnamed"}
                        </p>
                        {lead.email_from && (
                          <p className="text-xs text-[#8a8580] truncate">{lead.email_from}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {lead.x_investment_amount ? (
                            <span className="text-xs text-[#c5a059] font-mono">
                              ${lead.x_investment_amount.toLocaleString()}
                            </span>
                          ) : null}
                          {lead.x_contract_status && typeof lead.x_contract_status === "string" ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${
                              lead.x_contract_status === "signed"
                                ? "bg-green-500/10 text-green-400"
                                : lead.x_contract_status === "sent"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : lead.x_contract_status === "cancelled"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-white/5 text-[#8a8580]"
                            }`}>
                              {lead.x_contract_status}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Table */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="font-display font-semibold text-lg mb-4">All VGR Leads</h3>
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
                  <th className="text-left py-2 text-[#6b6560] font-mono text-xs uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: VgrLead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3">{lead.partner_name || lead.name || "—"}</td>
                    <td className="py-3 text-[#8a8580]">{lead.email_from || "—"}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-lg bg-[#c5a059]/10 text-[#c5a059]">
                        {Array.isArray(lead.stage_id) ? lead.stage_id[1] : "—"}
                      </span>
                    </td>
                    <td className="py-3 text-[#c5a059]">
                      {lead.x_investment_amount ? `$${lead.x_investment_amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3">
                      {lead.x_contract_status && typeof lead.x_contract_status === "string"
                        ? lead.x_contract_status
                        : "—"}
                    </td>
                    <td className="py-3 text-[#6b6560]">
                      {lead.create_date ? new Date(lead.create_date).toLocaleDateString() : "—"}
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

/* ========== SUPPLIER PRODUCTS TAB ========== */
function SupplierProductsTab() {
  const { data, isLoading } = trpc.partner.getSupplierProducts.useQuery();

  if (isLoading) return <LoadingSpinner />;

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl">Real Estate Products (Odoo)</h2>
        <span className="text-xs text-[#6b6560] font-mono">{products.length} products</span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: SupplierProduct) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-[#c5a059]/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-base">{product.name}</h3>
                <span className="text-[#c5a059] font-display font-bold text-lg">
                  ${product.list_price.toLocaleString()}
                </span>
              </div>

              {product.description_sale && typeof product.description_sale === "string" && (
                <p className="text-xs text-[#8a8580] mb-3 line-clamp-2">{product.description_sale}</p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.x_projected_roi ? (
                  <div className="flex items-center gap-1 text-[#8a8580]">
                    <TrendingUp size={12} className="text-green-400" />
                    ROI: {product.x_projected_roi}%
                  </div>
                ) : null}
                {(product.x_location_lat && product.x_location_long) ? (
                  <div className="flex items-center gap-1 text-[#8a8580]">
                    <MapPin size={12} className="text-[#c5a059]" />
                    {product.x_location_lat.toFixed(4)}, {product.x_location_long.toFixed(4)}
                  </div>
                ) : null}
                {product.x_total_units ? (
                  <div className="flex items-center gap-1 text-[#8a8580]">
                    <Users2 size={12} />
                    {product.x_available_units ?? 0} / {product.x_total_units} units
                  </div>
                ) : null}
                {product.x_documents_link && typeof product.x_documents_link === "string" ? (
                  <a
                    href={product.x_documents_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#c5a059] hover:underline"
                  >
                    <FileText size={12} />
                    Documents
                  </a>
                ) : null}
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#6b6560] uppercase">
                  {Array.isArray(product.categ_id) ? product.categ_id[1] : "Uncategorized"}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  product.active !== false
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}>
                  {product.active !== false ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <Package size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">No real estate products found in Odoo</p>
        </div>
      )}
    </div>
  );
}

/* ========== TASKS TAB ========== */
function TasksTab() {
  const { data, isLoading, error } = trpc.partner.getTasks.useQuery({});

  if (isLoading) return <LoadingSpinner />;

  const tasks = data?.result || [];

  return (
    <div className="space-y-6">
      <h2 className="font-display font-semibold text-xl">My Tasks (PMA Company Formation)</h2>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-2 text-red-400">
          <AlertCircle size={16} />
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <FileText size={32} className="text-[#6b6560] mx-auto mb-3" />
          <p className="text-[#6b6560]">Şu anda atanmış görev bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: OdooTask) => {
            const stageName = Array.isArray(task.stage_id) ? task.stage_id[1] : "Belirtilmemiş";
            const isComplete = stageName === "Teslimat";
            return (
              <div
                key={task.id}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-[#c5a059]/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-base">{task.name}</h3>
                    <span className="text-xs text-[#8a8580]">{stageName}</span>
                  </div>
                  {isComplete ? (
                    <CheckCircle2 size={20} className="text-green-400" />
                  ) : (
                    <Clock size={20} className="text-[#c5a059]" />
                  )}
                </div>

                {task.x_portal_status_percentage !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#8a8580]">Progress</span>
                      <span className="text-xs font-mono text-[#c5a059]">{task.x_portal_status_percentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div
                        className="bg-[#c5a059] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${task.x_portal_status_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {task.description && typeof task.description === "string" && (
                  <p className="text-xs text-[#8a8580] mb-3">{task.description}</p>
                )}

                {task.date_deadline && typeof task.date_deadline === "string" && (
                  <p className="text-xs text-[#6b6560] mb-3">
                    Deadline: {new Date(task.date_deadline).toLocaleDateString("tr-TR")}
                  </p>
                )}

                <a
                  href={`https://pt-telkon-one-group.odoo.com/web#id=${task.id}&model=project.task`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#c5a059] font-medium hover:underline"
                >
                  View in Odoo <ExternalLink size={12} />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========== STAT CARD ========== */
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className={`${color} mb-3`}>{icon}</div>
      <div className="font-display font-bold text-2xl mb-1">{value}</div>
      <div className="text-xs text-[#6b6560] uppercase tracking-wider">{label}</div>
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
