import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaSave, FaTimes, FaImage } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { UpdateOwner, UpdateTenant } from "../services/ownerTenantService";
import api from "../services/Api";
import { useDispatch } from "react-redux";
import { LogoutUser } from "../redux/features/AuthSlice";

const fields = [
  ["Full_name","Full Name"],["Phone_number","Phone Number"],["Email_address","Email Address"],
  ["Age","Age"],["Gender","Gender"],["Wing","Wing"],["Unit","Unit"],["Relation","Relation"]
];

export default function InteractivePersonalDetails({ user }) {
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({...user});
  const [extras,setExtras]=useState(()=>JSON.parse(localStorage.getItem("resident-extra-details")||"[]"));
  const [extraForm,setExtraForm]=useState({label:"",value:""});
  const [adding,setAdding]=useState(false);
  const dispatch=useDispatch();

  useEffect(()=>setForm({...user}),[user]);

  const save = async () => {
    try {
      const fd=new FormData();
      fields.forEach(([key])=>fd.append(key, form[key] ?? ""));
      fd.append("Resident_status", form.Resident_status || "Owner");
      fd.append("UnitStatus", form.UnitStatus || "Occupied");
      fd.append("Member_Counting", JSON.stringify(form.Member_Counting || []));
      fd.append("Vehicle_Counting", JSON.stringify(form.Vehicle_Counting || []));
      const isTenant = form.Resident_status === "Tenante" || form.Resident_status === "Tenant";
      const r = isTenant ? await UpdateTenant(form._id,fd) : await UpdateOwner(form._id,fd);
      toast.success(r.data.message || "Personal details updated");
      setEditing(false);
      window.location.reload();
    } catch(e) { toast.error(e.response?.data?.message || "Update failed"); }
  };

  const addExtra=()=>{
    if(!extraForm.label.trim() || !extraForm.value.trim()) return;
    const next=[...extras,{...extraForm,id:Date.now()}];
    setExtras(next); localStorage.setItem("resident-extra-details",JSON.stringify(next));
    setExtraForm({label:"",value:""}); setAdding(false); toast.success("Detail added");
  };
  const deleteExtra=(id)=>{
    const next=extras.filter(x=>x.id!==id); setExtras(next); localStorage.setItem("resident-extra-details",JSON.stringify(next));
  };

  const deleteAccount=async()=>{
    if(!window.confirm("Delete this resident record permanently?")) return;
    try {
      await api.delete(`/v2/resident/resident/${user._id}`);
      toast.success("Resident record deleted");
      dispatch(LogoutUser());
      window.location.href="/";
    } catch(e) { toast.error(e.response?.data?.message || "Unable to delete record"); }
  };

  return <div className="space-y-5">
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div><p className="text-xs uppercase tracking-[.18em] text-cyan-600 font-bold">My profile</p><h2 className="text-2xl font-bold mt-1">Personal Details</h2><p className="text-sm text-slate-500 mt-1">Keep your resident information current.</p></div>
        <div className="flex flex-wrap gap-2">
          {!editing ? <button onClick={()=>setEditing(true)} className="px-4 py-2.5 rounded-xl bg-custom-gradient text-white font-semibold flex gap-2 items-center"><FaEdit/> Edit</button> :
          <><button onClick={save} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold flex gap-2 items-center"><FaSave/> Save</button><button onClick={()=>{setForm({...user});setEditing(false)}} className="px-4 py-2.5 rounded-xl border flex gap-2 items-center"><FaTimes/> Cancel</button></>}
          <button onClick={deleteAccount} className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold flex gap-2 items-center"><FaTrash/> Delete</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fields.map(([key,label])=><label key={key} className="text-sm"><span className="block text-slate-500 mb-1">{label}</span>
          {editing ? <input value={form[key] ?? ""} onChange={e=>setForm({...form,[key]:e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-200"/> :
          <span className="font-semibold">{form[key] || "—"}</span>}
        </label>)}
      </div>
    </div>

    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4"><div><h3 className="text-lg font-bold">Additional Details</h3><p className="text-sm text-slate-500">Add small profile details for your dashboard.</p></div><button onClick={()=>setAdding(true)} className="px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-cyan-600 flex items-center gap-2"><FaPlus/> Add</button></div>
      {adding && <div className="grid sm:grid-cols-2 gap-3 mb-4"><input placeholder="Label e.g. Emergency Contact" value={extraForm.label} onChange={e=>setExtraForm({...extraForm,label:e.target.value})} className="rounded-xl border p-3"/><input placeholder="Value" value={extraForm.value} onChange={e=>setExtraForm({...extraForm,value:e.target.value})} className="rounded-xl border p-3"/><div className="flex gap-2"><button onClick={addExtra} className="px-4 py-2 bg-emerald-600 text-white rounded-xl">Save</button><button onClick={()=>setAdding(false)} className="px-4 py-2 border rounded-xl">Cancel</button></div></div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {extras.map(x=><div key={x.id} className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 flex justify-between"><div><p className="text-xs text-slate-500">{x.label}</p><p className="font-semibold mt-1">{x.value}</p></div><button onClick={()=>deleteExtra(x.id)} className="text-rose-500"><FaTrash/></button></div>)}
        {!extras.length && !adding && <p className="text-sm text-slate-500">No additional details yet.</p>}
      </div>
    </div>
  </div>
}
