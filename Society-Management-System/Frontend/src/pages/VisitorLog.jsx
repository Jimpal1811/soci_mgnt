import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { GetVisitors, createVisitor, updateVisitor, deleteVisitor } from "../services/securityGuardService";
import { convert24hrTo12hr } from "../utils/ConvertTime";
import { Loader } from "../utils/Loader";

const blank = { name: "", number: "", date: new Date().toISOString().slice(0,10), wing: "A", unit: "101", time: "" };

export default function VisitorLogs() {
  const [visitorLog, setVisitorLog] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchVisitors = async () => {
    try { setLoading(true); const response = await GetVisitors(); setVisitorLog(response.data.data || []); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to load visitors"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchVisitors(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editing) {
        const r = await updateVisitor(editing._id, form);
        toast.success(r.data.message);
      } else {
        const r = await createVisitor(form);
        toast.success(r.data.message);
      }
      setOpen(false); setEditing(null); setForm(blank); fetchVisitors();
    } catch (error) { toast.error(error.response?.data?.message || "Unable to save visitor"); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this visitor record?")) return;
    try { await deleteVisitor(id); toast.success("Visitor deleted successfully"); fetchVisitors(); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to delete visitor"); }
  };

  const filtered = visitorLog.filter(v =>
    `${v.name} ${v.number} ${v.wing}${v.unit}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan-600 font-bold">Security Management</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Visitor Log</h1>
          <p className="text-sm text-slate-500 mt-1">Create, update and remove visitor records from one place.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-400 text-sm"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search visitor..." className="pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none"/>
          </div>
          <button onClick={()=>{setEditing(null);setForm(blank);setOpen(true)}} className="px-4 py-2.5 rounded-xl text-white font-semibold bg-custom-gradient flex items-center gap-2 shadow-md">
            <FaPlus/> Add Visitor
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="min-w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>{["Visitor","Phone","Date","Unit","Time","Actions"].map(h=><th key={h} className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading && !visitorLog.length ? <tr><td colSpan="6" className="py-12"><Loader/></td></tr> :
              filtered.length ? filtered.map((v,i)=><tr key={v._id || i} className="border-t border-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                <td className="px-5 py-4 font-semibold">{v.name}</td>
                <td className="px-5 py-4">{v.number}</td>
                <td className="px-5 py-4">{new Date(v.date).toLocaleDateString("en-GB")}</td>
                <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold">{v.wing} - {v.unit}</span></td>
                <td className="px-5 py-4">{v.time ? convert24hrTo12hr(v.time) : "-"}</td>
                <td className="px-5 py-4"><div className="flex gap-2">
                  <button onClick={()=>{setEditing(v);setForm({...blank,...v,date:v.date?.slice(0,10) || blank.date});setOpen(true)}} className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><FaEdit/></button>
                  <button onClick={()=>remove(v._id)} className="p-2 rounded-lg bg-rose-50 text-rose-600"><FaTrash/></button>
                </div></td>
              </tr>) :
              <tr><td colSpan="6" className="py-12 text-center text-slate-500">No visitor records found.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && <div className="fixed inset-0 z-[10000] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
        <form onSubmit={submit} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl animate-[softAppear_.25s_ease]">
          <div className="flex justify-between items-center mb-5"><div><h2 className="text-xl font-bold">{editing ? "Update Visitor" : "Add Visitor"}</h2><p className="text-sm text-slate-500">Keep entry details accurate for security records.</p></div><button type="button" onClick={()=>setOpen(false)}><FaTimes/></button></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["name","Visitor Name","text"],["number","Phone Number","tel"],["date","Visit Date","date"],["wing","Wing","text"],["unit","Unit Number","text"],["time","Visit Time","time"]
            ].map(([key,label,type])=><label key={key} className="text-sm font-semibold"><span className="block mb-1">{label}</span><input required={["name","number","wing","unit"].includes(key)} type={type} value={form[key] || ""} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-200"/></label>)}
          </div>
          <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={()=>setOpen(false)} className="px-4 py-2.5 rounded-xl border">Cancel</button><button disabled={loading} className="px-5 py-2.5 rounded-xl text-white font-semibold bg-custom-gradient">{editing ? "Update Visitor" : "Save Visitor"}</button></div>
        </form>
      </div>}
    </div>
  );
}
