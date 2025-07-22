import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { Switch } from "./switch";
import { Shield, CheckCircle, Clock, Wallet, Plus, ExternalLink } from "lucide-react";
import KiteLogo from "../../assets/KiteLogo.png";
// import type { KitePass, Transaction } from "@shared/schema";

interface KitePass {
  passId: string;
  monthlyLimit: string;
  usedThisMonth: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface KitePassDialogProps {
  kitePass?: KitePass;
  transactions: Transaction[];
  children: React.ReactNode;
}

export default function KitePassDialog({ kitePass, transactions, children }: KitePassDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {open && (
        <DialogContent className={kitePass ? "w-[75vw] max-w-none max-h-[80vh] overflow-y-auto p-8" : "max-w-md"}>
          {kitePass ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <img src={KiteLogo} alt="Kite Logo" className="w-6 h-6" />
                    </div>
                    <span>Kite Payment Authorization</span>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                    Active
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                {/* Left: Details (2/3) */}
                <div className="md:col-span-2 space-y-8 w-full">
                  {/* KitePass Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Pass ID</label>
                          <p className="font-mono text-sm font-semibold text-gray-800">{kitePass.passId}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Connected Wallet</label>
                          <p className="font-mono text-xs text-gray-800">
                            {JSON.parse(localStorage.getItem("currentUser") || "{}")?.walletAddress?.slice(0, 6)}...{JSON.parse(localStorage.getItem("currentUser") || "{}")?.walletAddress?.slice(-4)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Created</label>
                          <p className="text-xs text-gray-800">
                            {new Date(kitePass.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Monthly Limit</label>
                          <p className="text-lg font-semibold text-gray-800">${kitePass.monthlyLimit}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Used This Month</label>
                          <p className="text-lg font-semibold text-blue-600">${kitePass.usedThisMonth}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Remaining</label>
                          <p className="text-lg font-semibold text-green-600">
                            {(parseFloat(kitePass.monthlyLimit) - parseFloat(kitePass.usedThisMonth)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 uppercase tracking-wide">Monthly Usage</span>
                        <span className="text-sm font-medium text-gray-800">{((parseFloat(kitePass.usedThisMonth) / parseFloat(kitePass.monthlyLimit)) * 100).toFixed(0)}% used</span>
                      </div>
                      <Progress value={(parseFloat(kitePass.usedThisMonth) / parseFloat(kitePass.monthlyLimit)) * 100} className="h-2" />
                    </div>
                  </div>
                  {/* Recent Authorizations */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Recent Authorizations</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 3).map((auth) => (
                        <div key={auth.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${auth.status === "completed" ? "bg-green-500" : "bg-yellow-400"}`}>
                              {auth.status === "completed" ? (
                                <CheckCircle className="text-white w-5 h-5" />
                              ) : (
                                <Clock className="text-white w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-800">{auth.description}</h4>
                              <p className="text-xs text-gray-500">
                                {new Date(auth.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">${auth.amount}</p>
                            <Badge className={`text-xs ${auth.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {auth.status === "completed" ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {transactions.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <p className="text-sm">No authorizations yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right: Side Panel (1/3) */}
                <div className="space-y-8 w-full">
                  {/* Plan Rules */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-800 mb-4">Plan Rules</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-sm text-blue-900">Equipment category ≤ $5,000 / month</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-sm text-blue-900">Utility category ≤ $2,000 / month</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-sm text-blue-900">Wages category ≤ $2,000 / month</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-sm text-blue-900">Reserve category ≤ $1,000 / month</span>
                      </li>
                    </ul>
                  </div>
                  {/* Integration Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Integration Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-xs text-gray-700">Vishwa AI Connected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-xs text-gray-700">Wallet Authorized</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-xs text-gray-700">KitePass Active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-xs text-gray-700">Rules Configured</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open('https://kite.example.com', '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Open in Kite Portal
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img src={KiteLogo} alt="Kite Logo" className="w-6 h-6" />
                  </div>
                  <span>Kite Authorization</span>
                </DialogTitle>
              </DialogHeader>
              <div className="text-center py-6">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img src={KiteLogo} alt="Kite Logo" className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No KitePass Connected</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Activate this spending plan to automatically create a KitePass for secure payment authorization.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(false)}>
                  Activate Plan to Connect
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
} 