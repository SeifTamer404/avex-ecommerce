"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "@/store/slices/uiSlice";
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from "@/features/user/actions";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { MapPin, Plus, Edit2, Trash2, X } from "lucide-react";

export default function AddressManager({ initialAddresses, userId }) {
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", zip: "", country: "", buildingDetails: "", isDefault: false
  });

  const resetForm = () => {
    setFormData({
      fullName: "", phone: "", street: "", city: "", state: "", zip: "", country: "", buildingDetails: "", isDefault: false
    });
    setEditingAddress(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (addr) => {
    setFormData({ 
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "",
      buildingDetails: addr.buildingDetails || "",
      isDefault: addr.isDefault || false
    });
    setEditingAddress(addr._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    
    // Optimistic Update
    const previousAddresses = [...addresses];
    setAddresses(addresses.filter(a => a._id !== addressId));

    try {
      const updated = await deleteAddress(userId, addressId);
      setAddresses(updated);
      dispatch(uiActions.addNotification({
        id: `delete-addr-success-${Date.now()}`,
        message: "Address deleted successfully.",
        type: "success"
      }));
    } catch (error) {
      console.error(error);
      dispatch(uiActions.addNotification({
        id: `delete-addr-err-${Date.now()}`,
        message: "Failed to delete address. Please try again.",
        type: "error"
      }));
      setAddresses(previousAddresses); // Revert
    }
  };

  const handleSetDefault = async (addressId) => {
    // Optimistic Update
    const previousAddresses = [...addresses];
    setAddresses(addresses.map(a => ({ ...a, isDefault: a._id === addressId })));

    try {
      const updated = await setDefaultAddress(userId, addressId);
      setAddresses(updated);
      dispatch(uiActions.addNotification({
        id: `default-addr-success-${Date.now()}`,
        message: "Default address updated.",
        type: "success"
      }));
    } catch (error) {
      console.error(error);
      dispatch(uiActions.addNotification({
        id: `default-addr-err-${Date.now()}`,
        message: "Failed to set default address. Please try again.",
        type: "error"
      }));
      setAddresses(previousAddresses);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        const updated = await updateAddress(userId, editingAddress, formData);
        setAddresses(updated);
        dispatch(uiActions.addNotification({
          id: `update-addr-success-${Date.now()}`,
          message: "Address updated successfully.",
          type: "success"
        }));
      } else {
        const updated = await addAddress(userId, formData);
        setAddresses(updated);
        dispatch(uiActions.addNotification({
          id: `add-addr-success-${Date.now()}`,
          message: "Address added successfully.",
          type: "success"
        }));
      }
      resetForm();
    } catch (error) {
      console.error(error);
      dispatch(uiActions.addNotification({
        id: `save-addr-err-${Date.now()}`,
        message: editingAddress ? "Failed to update address." : "Failed to add address.",
        type: "error"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--color-inverted-bg)] mb-1">
            Saved Addresses
          </h1>
          <p className="text-[var(--color-inverted-bg)]/60 text-sm">
            Manage your shipping and billing addresses for a faster checkout.
          </p>
        </div>
        {!isFormOpen && (
          <Button type="primary" size="sm" onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold font-display text-[var(--color-inverted-bg)]">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <button onClick={resetForm} className="p-2 rounded-full hover:bg-[var(--color-outline-variant)]/30 text-[var(--color-inverted-bg)]/60 hover:text-[var(--color-inverted-bg)] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              <Input label="Phone Number" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <div className="md:col-span-2">
                <Input label="Street Address" required value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
              </div>
              <Input label="Building / Apt (Optional)" value={formData.buildingDetails} onChange={(e) => setFormData({...formData, buildingDetails: e.target.value})} />
              <Input label="City" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              <Input label="State / Province" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              <Input label="ZIP / Postal Code" required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} />
              <div className="md:col-span-2">
                <Input label="Country" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-[var(--color-surface-highest)]/50 rounded-xl border border-[var(--color-outline-variant)]/30 w-fit">
              <input type="checkbox" className="w-4 h-4 rounded border-[var(--color-outline-variant)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} />
              <span className="text-sm font-medium text-[var(--color-inverted-bg)]">Set as default shipping address</span>
            </label>

            <div className="flex justify-end gap-3 pt-6 border-t border-[var(--color-outline-variant)]/50">
              <Button type="secondary" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="primary" size="sm" htmlType="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (editingAddress ? "Save Changes" : "Add Address")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {!isFormOpen && addresses.length === 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-16 text-center flex flex-col items-center shadow-sm">
          <div className="w-20 h-20 bg-[var(--color-outline-variant)]/20 rounded-full flex items-center justify-center mb-4 text-[var(--color-inverted-bg)]/30">
            <MapPin className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold font-display text-[var(--color-inverted-bg)] mb-2">No addresses saved</h4>
          <p className="text-[var(--color-inverted-bg)]/60 mb-6 max-w-sm">
            Add a shipping address to speed up your checkout process.
          </p>
          <Button type="primary" size="sm" onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        </div>
      )}

      {!isFormOpen && addresses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address._id} className={`bg-[var(--color-surface)] border ${address.isDefault ? 'border-[var(--color-primary)]/50 ring-1 ring-[var(--color-primary)]/20 shadow-md' : 'border-[var(--color-outline-variant)]/50 hover:border-[var(--color-primary)]/30 shadow-sm'} rounded-3xl p-6 relative group transition-all`}>
              {address.isDefault && (
                <div className="absolute top-6 right-6">
                  <Badge label="DEFAULT" variant="primary" />
                </div>
              )}
              
              <div className="mb-4 pr-24">
                <h3 className="font-bold text-[var(--color-inverted-bg)] flex items-center gap-2 text-lg">
                  <MapPin className={`w-5 h-5 ${address.isDefault ? 'text-[var(--color-primary)]' : 'text-[var(--color-inverted-bg)]/40'}`} />
                  {address.fullName}
                </h3>
              </div>
              
              <div className="space-y-1.5 text-sm text-[var(--color-inverted-bg)]/70 mb-6 font-medium">
                <p>{address.street} {address.buildingDetails ? `, ${address.buildingDetails}` : ""}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
                <p className="pt-3 flex items-center gap-2">
                  <span className="text-[var(--color-inverted-bg)]/40 text-xs uppercase tracking-wider font-bold">Phone</span> 
                  {address.phone}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-5 border-t border-[var(--color-outline-variant)]/50">
                <button 
                  onClick={() => handleOpenEdit(address)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-inverted-bg)]/60 hover:text-[var(--color-primary)] transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(address._id)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-inverted-bg)]/60 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>

                {!address.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(address._id)}
                    className="ml-auto text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
