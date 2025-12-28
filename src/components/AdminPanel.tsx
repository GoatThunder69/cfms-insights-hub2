import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAllKeys,
  getAllLogs,
  createKey,
  deleteKey,
  generateRandomKey,
  clearLogs,
  LoginKey,
  SearchLog,
} from "@/lib/database";
import {
  ShieldCheck,
  LogOut,
  Key,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  Search,
  Copy,
  Check,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<"keys" | "logs">("keys");
  const [keys, setKeys] = useState<LoginKey[]>([]);
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setKeys(getAllKeys());
    setLogs(getAllLogs());
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }

    const keyValue = newKeyValue.trim() || generateRandomKey();
    createKey(newKeyName.trim(), keyValue);
    toast.success("Key created successfully");
    setNewKeyName("");
    setNewKeyValue("");
    refreshData();
  };

  const handleDeleteKey = (id: string, name: string) => {
    if (confirm(`Delete key "${name}"? This action cannot be undone.`)) {
      deleteKey(id);
      toast.success("Key deleted");
      refreshData();
    }
  };

  const handleClearLogs = () => {
    if (confirm("Clear all logs? This action cannot be undone.")) {
      clearLogs();
      toast.success("Logs cleared");
      refreshData();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const generateNewKey = () => {
    setNewKeyValue(generateRandomKey());
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-warning/20 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-warning" />
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "keys" ? "default" : "outline"}
            onClick={() => setActiveTab("keys")}
            className={activeTab === "keys" ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}
          >
            <Key className="w-4 h-4 mr-2" />
            Access Keys
          </Button>
          <Button
            variant={activeTab === "logs" ? "default" : "outline"}
            onClick={() => setActiveTab("logs")}
            className={activeTab === "logs" ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}
          >
            <FileText className="w-4 h-4 mr-2" />
            Search Logs
          </Button>
        </div>

        {activeTab === "keys" ? (
          <div className="space-y-6 animate-fade-in">
            {/* Create Key */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-warning" />
                Create New Key
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Key Name</label>
                  <Input
                    placeholder="e.g., User Alpha"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Key Value (auto-generated if empty)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Auto-generated"
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={generateNewKey}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateKey} className="bg-warning text-warning-foreground hover:bg-warning/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Key
              </Button>
            </div>

            {/* Keys List */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Key className="w-5 h-5 text-warning" />
                  Active Keys ({keys.length})
                </h2>
                <Button variant="ghost" size="sm" onClick={refreshData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {keys.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No keys created yet</p>
              ) : (
                <div className="space-y-3">
                  {keys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{key.name}</div>
                        <div className="font-mono text-sm text-primary truncate">{key.key}</div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created: {new Date(key.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Search className="w-3 h-3" />
                            Uses: {key.usageCount}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(key.key, key.id)}
                        >
                          {copiedId === key.id ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteKey(key.id, key.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                Search Logs ({logs.length})
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={refreshData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleClearLogs}
                  disabled={logs.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No search logs yet</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start justify-between p-3 rounded-lg border ${
                      log.success
                        ? "bg-success/5 border-success/20"
                        : "bg-destructive/5 border-destructive/20"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {log.success ? (
                          <Check className="w-4 h-4 text-success flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                        )}
                        <span className="font-mono text-sm text-foreground">
                          {log.endpoint}?{log.parameter}={log.value}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Key: {log.keyName}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
