// components/shopping-view/Address.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/CommonForm";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  fetchAllAddresses,
  deleteAddress,
  editAddress,
} from "@/store/shop/address-slice";
import { toast } from "sonner";
import { Button } from "../ui/button";
import AddressCard from "../shopping-view/AddressCard";

const initialAddressFormData = {
  address: "",
  phone: "",
  city: "",
  pincode: "",
  notes: "",
};

export default function Address({ setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [loading, setLoading] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList, isLoading } = useSelector((state) => state.shopAddress);

  // ✅ Fetch all addresses when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user]);

  // ✅ Handle Add / Update Address
  function handleManageAddress(e) {
    e.preventDefault();
    if (loading) return;

    // ✅ Restrict to only 3 addresses
    if (!editingAddressId && addressList.length >= 3) {
      toast.error("⚠️ You can only add up to 3 addresses!");
      return;
    }

    setLoading(true);

    if (editingAddressId) {
      // Editing existing address
      dispatch(
        editAddress({
          userId: user?.id,
          addressId: editingAddressId,
          updates: formData,
        })
      )
        .then((data) => {
          if (data?.payload) {
            toast.success("✏️ Address updated successfully!");
            setEditingAddressId(null);
            setFormData(initialAddressFormData);
            dispatch(fetchAllAddresses(user.id));
          } else {
            toast.error("❌ Failed to update address.");
          }
        })
        .catch(() => toast.error("⚠️ Something went wrong!"))
        .finally(() => setLoading(false));
    } else {
      // Adding new address
      dispatch(addNewAddress({ ...formData, userId: user?.id }))
        .then((data) => {
          if (data?.payload) {
            toast.success("✅ Address added successfully!");
            setFormData(initialAddressFormData);
            dispatch(fetchAllAddresses(user.id));
          } else {
            toast.error("❌ Failed to add address.");
          }
        })
        .catch(() => toast.error("⚠️ Something went wrong!"))
        .finally(() => setLoading(false));
    }
  }

  // ✅ Delete address
  function handleDeleteAddress(addressId) {
    if (!user?.id) return;
    dispatch(deleteAddress({ userId: user.id, addressId }))
      .then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          toast.success("🗑️ Address deleted successfully!");
        } else {
          toast.error("❌ Failed to delete address.");
        }
      })
      .catch(() => toast.error("⚠️ Something went wrong!"));
  }

  // ✅ Edit address (fill form)
  function handleEditAddress(addr) {
    setEditingAddressId(addr._id);
    setFormData({
      address: addr.address,
      phone: addr.phone,
      city: addr.city,
      pincode: addr.pincode,
      notes: addr.notes || "",
    });
  }

  // ✅ Form validation
  function isFormValid() {
    const { address, phone, city, pincode } = formData;
    return [address, phone, city, pincode].every((val) => val.trim() !== "");
  }

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    setCurrentSelectedAddress(address); // update parent state
  };

  return (
    <Card>
      {/* ✅ Saved addresses section */}
      <CardHeader>
        <CardTitle>Saved Addresses</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p>Loading addresses...</p>
        ) : addressList.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addressList.map((addr) => (
              <AddressCard
                key={addr._id}
                addressInfo={addr}
                onEdit={() => handleEditAddress(addr)}
                onDelete={() => handleDeleteAddress(addr._id)}
                selectedAddressId={selectedAddressId}
                setCurrentSelectedAddress={handleSelectAddress}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No addresses found.</p>
        )}
      </CardContent>

      {/* ✅ Add/Edit address form */}
      <CardHeader>
        <CardTitle>
          {editingAddressId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={
            loading
              ? editingAddressId
                ? "Updating..."
                : "Adding..."
              : editingAddressId
              ? "Update"
              : addressList.length >= 3
              ? "Limit Reached"
              : "Add"
          }
          onSubmit={handleManageAddress}
          disabled={
            !isFormValid() ||
            loading ||
            (!editingAddressId && addressList.length >= 3)
          }
        />

        {editingAddressId && (
          <Button
            variant="secondary"
            onClick={() => {
              setEditingAddressId(null);
              setFormData(initialAddressFormData);
            }}
          >
            Cancel Edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
