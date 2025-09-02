// src/pages/AdminSettings.jsx
import React, { useEffect, useState } from "react";
import { getAccessToken } from "../utils/token";
import "./CSS/AdminProduct.css";
import "./CSS/AdminCategory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL ;

const DEFAULT_FORM = {
  min_price: "",
  site_name: "",
  site_tagline: "",
  site_email: "",
  currency_name: "",
  currency_code: "",
  currency_symbol: "",
  commission_rate: "",
  min_withdraw: "",
  withdraw_fee_type: "",
  withdraw_fee_rate: "",
  payout_hold_days: "",
  support_email: "",
  support_phone: "",
  support_address: "",
  social_links: "",
  reg_enabled: false,
  email_verify: false,
  product_approval: false,
  max_images: "",
};

const CATEGORY_KEYS = {
  general: [
    "site_name",
    "site_tagline",
    "site_email",
    "currency_name",
    "currency_code",
    "currency_symbol",
  ],
  contact: ["support_email", "support_phone", "support_address"],
  financial: [
    "commission_rate",
    "min_withdraw",
    "withdraw_fee_type",
    "withdraw_fee_rate",
    "payout_hold_days",
  ],
  products: ["product_approval", "max_images", "min_price"],
  social: ["social_links"],
  users: ["reg_enabled", "email_verify"],
};

// Helper: take raw app or flat response and normalize for UI display
function normalizeAppRaw(raw) {
  const first = Array.isArray(raw) && raw.length ? raw[0] : raw || {};
  const out = {};

  for (const cat of Object.keys(CATEGORY_KEYS)) {
    const catObj = first?.[cat];
    if (catObj && typeof catObj === "object") {
      out[cat] = {};
      for (const k of Object.keys(catObj)) {
        const v = catObj[k];
        out[cat][k] =
          v && typeof v === "object" && "value" in v ? v.value : v;
      }
    } else {
      out[cat] = {};
      for (const k of CATEGORY_KEYS[cat]) {
        if (typeof first[k] !== "undefined") {
          out[cat][k] = first[k];
        }
      }
    }
  }

  return out;
}

function normalizeFlatRaw(raw) {
  const obj = Array.isArray(raw) && raw.length ? raw[0] : raw || {};
  return obj;
}

// Helper: get site_name/site_email from either normalized app or flat
function pickSiteName(normalizedApp, flatObj) {
  return (
    (normalizedApp?.general?.site_name ?? null) ||
    flatObj?.site_name ||
    "-"
  );
}
function pickSiteEmail(normalizedApp, flatObj) {
  return (
    (normalizedApp?.general?.site_email ?? null) ||
    flatObj?.site_email ||
    "-"
  );
}

const AdminSettings = () => {
  const [appSettingsRaw, setAppSettingsRaw] = useState([]); // raw response
  const [flatSettingsRaw, setFlatSettingsRaw] = useState([]); // raw response
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  // Details modal for App (cards) and Flat (view)
  const [appDetailsOpen, setAppDetailsOpen] = useState(false);
  const [flatModalOpen, setFlatModalOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);

  // Fetch settings (GET /v1/admin/settings) and flat (GET /v1/admin/settings/flat)
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErr("");
      const token = await getAccessToken();

      // App settings
      const urlApp = `${BASE_URL}/v1/admin/settings`;
      const resApp = await fetch(urlApp, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const dataApp = await resApp.json();
      console.log("GET /v1/admin/settings response:", dataApp);
      const appData = dataApp?.data ?? [];
      setAppSettingsRaw(Array.isArray(appData) ? appData : [appData]);

      // Flat settings
      const urlFlat = `${BASE_URL}/v1/admin/settings/flat`;
      const resFlat = await fetch(urlFlat, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const dataFlat = await resFlat.json();
      console.log("GET /v1/admin/settings/flat response:", dataFlat);
      const flatData = dataFlat?.data ?? [];
      setFlatSettingsRaw(Array.isArray(flatData) ? flatData : [flatData]);
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fill edit form with best-effort values from appSettingsRaw (supports nested shapes)
  const openEditModal = (sourceOverride = null) => {
    const appFirst = Array.isArray(appSettingsRaw) && appSettingsRaw.length
      ? appSettingsRaw[0]
      : appSettingsRaw;
    
    const normalizedApp = normalizeAppRaw(appSettingsRaw);
    const flatObj = normalizeFlatRaw(flatSettingsRaw);

    const getVal = (key) => {
      for (const cat of Object.keys(normalizedApp)) {
        if (normalizedApp[cat] && typeof normalizedApp[cat][key] !== "undefined") {
          return normalizedApp[cat][key];
        }
      }
      if (typeof flatObj[key] !== "undefined") return flatObj[key];
      if (appFirst && typeof appFirst[key] !== "undefined") return appFirst[key];
      return null;
    };

    const pre = { ...DEFAULT_FORM };
    Object.keys(pre).forEach((k) => {
      const v = getVal(k);
      if (v !== null && typeof v !== "undefined") {
        pre[k] = typeof v === "object" ? JSON.stringify(v) : v;
      }
    });

    pre.reg_enabled = Boolean(getVal("reg_enabled") || pre.reg_enabled);
    pre.email_verify = Boolean(getVal("email_verify") || pre.email_verify);
    pre.product_approval = Boolean(getVal("product_approval") || pre.product_approval);

    setEditForm(pre);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // Save settings (PUT /v1/admin/settings)
  const handleSaveSettings = async (e) => {
    e?.preventDefault?.();
    try {
      setSaving(true);
      const token = await getAccessToken();
      const url = `${BASE_URL}/v1/admin/settings`;

     

      const body = {
        min_price: editForm.min_price === "" ? null : Number(editForm.min_price),
        site_name: editForm.site_name || null,
        site_tagline: editForm.site_tagline || null,
        site_email: editForm.site_email || null,
        currency_name: editForm.currency_name || null,
        currency_code: editForm.currency_code || null,
        currency_symbol: editForm.currency_symbol || null,
        commission_rate: editForm.commission_rate === "" ? null : Number(editForm.commission_rate),
        min_withdraw: editForm.min_withdraw === "" ? null : Number(editForm.min_withdraw),
        withdraw_fee_type: editForm.withdraw_fee_type || null,
        withdraw_fee_rate: editForm.withdraw_fee_rate === "" ? null : Number(editForm.withdraw_fee_rate),
        payout_hold_days: editForm.payout_hold_days === "" ? null : Number(editForm.payout_hold_days),
        support_email: editForm.support_email || null,
        support_phone: editForm.support_phone || null,
        support_address: editForm.support_address || null,
        social_links: editForm.social_links
   ? (typeof editForm.social_links === "string"
      ? editForm.social_links
      : JSON.stringify(editForm.social_links))
  : null,
        reg_enabled: Boolean(editForm.reg_enabled),
        email_verify: Boolean(editForm.email_verify),
        product_approval: Boolean(editForm.product_approval),
        max_images: editForm.max_images === "" ? null : Number(editForm.max_images),
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("PUT /v1/admin/settings response:", data);

      if (data?.success) {
        await fetchSettings();
        setEditOpen(false);
        alert(data.message || "Settings updated");
      } else {
        alert(data?.message || "Failed to update settings");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // Flat details view (shows plain text, read-only, social links clickable)
  const openFlatDetails = (item) => {
    setSelectedFlat(item);
    setFlatModalOpen(true);
  };
  const closeFlatDetails = () => {
    setSelectedFlat(null);
    setFlatModalOpen(false);
  };

  // Render helpers
  const normalizedApp = normalizeAppRaw(appSettingsRaw);
  const normalizedFlat = normalizeFlatRaw(flatSettingsRaw);

  const siteNameApp = pickSiteName(normalizedApp, normalizedFlat);
  const siteEmailApp = pickSiteEmail(normalizedApp, normalizedFlat);

  const siteNameFlat = normalizedFlat?.site_name ?? siteNameApp;
  const siteEmailFlat = normalizedFlat?.site_email ?? siteEmailApp;

  // render social links (string or object)
  const renderSocialLinks = (raw) => {
    if (!raw && raw !== "") return null;
    let obj = raw;
    if (typeof raw === "string") {
      try {
        obj = JSON.parse(raw);
      } catch {
        // keep string
      }
    }
    if (obj && typeof obj === "object") {
      const entries = Object.entries(obj);
      if (entries.length === 0) return <div>-</div>;
      return entries.map(([k, v]) => (
        <div key={k}>
          <a href={String(v)} target="_blank" rel="noreferrer">{k}: {String(v)}</a>
        </div>
      ));
    }
    // fallback plain string
    return <div>{String(raw ?? "-")}</div>;
  };

  return (
    <div>
      <div className="main-area">
        <div className="breadcrumb-area">
          <span className="section-title">App Settings</span>
          <span className="breadcrumb">Admin &gt; Settings</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <button className="ducther2" onClick={() => fetchSettings()}>Refresh</button>
          </div>
          <div>
            {/* App settings are grouped & editable via modal cards → Edit buttons open the edit modal */}
            <button className="ducther2" onClick={() => { openEditModal(); }}>Edit Settings</button>
            <button className="ducther2" style={{ marginLeft: 8 }} onClick={() => setAppDetailsOpen(true)}>View Details</button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p>Loading settings...</p>
          ) : err ? (
            <p className="error">{err}</p>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ cursor: "pointer" }} onClick={() => { setAppDetailsOpen(true); }}>
                  <td>site_name</td>
                  <td>{siteNameApp ?? "-"}</td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal();
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                <tr style={{ cursor: "pointer" }} onClick={() => { setAppDetailsOpen(true); }}>
                  <td>site_email</td>
                  <td>{siteEmailApp ?? "-"}</td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal();
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Flat settings section (read-only plain text; social links clickable) */}
      <div className="main-area" style={{ marginTop: 24 }}>
        <div className="breadcrumb-area">
          <span className="section-title">Flat Settings</span>
        </div>

        <div style={{ marginBottom: 12 }}>
          <button className="ducther2" onClick={() => fetchSettings()}>Refresh</button>
        </div>

        <div className="table-container">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ cursor: "pointer" }} onClick={() => openFlatDetails(normalizedFlat)}>
                <td>site_name</td>
                <td>{siteNameFlat ?? "-"}</td>
                <td>
                  <button
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFlatDetails(normalizedFlat);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
              <tr style={{ cursor: "pointer" }} onClick={() => openFlatDetails(normalizedFlat)}>
                <td>site_email</td>
                <td>{siteEmailFlat ?? "-"}</td>
                <td>
                  <button
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFlatDetails(normalizedFlat);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* App Details Modal (cards) */}
      {appDetailsOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Application Settings — Details</h3>
              <div>
                <button className="ducther2" onClick={() => { openEditModal(); }}>Edit All</button>
                <button className="product-btn-close" style={{ marginLeft: 8 }} onClick={() => setAppDetailsOpen(false)}>Close</button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {/* Render each category as card if contains data */}
              {Object.keys(CATEGORY_KEYS).map((cat) => {
                const catObj = normalizedApp[cat] || {};
                const keys = Object.keys(catObj);
                if (!keys || keys.length === 0) return null;
                return (
                  <div key={cat} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <strong style={{ textTransform: "capitalize" }}>{cat}</strong>
                      <div>
                        <button
                          className="ducther2"
                          onClick={() => {
                            openEditModal();
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                      {keys.map((k) => {
                        const v = catObj[k];
                        // if social_links (object/string) render clickable if possible
                        const isSocial = k === "social_links";
                        const display = isSocial
                          ? null
                          : (typeof v === "object" ? JSON.stringify(v) : String(v ?? "-"));
                        return (
                          <div key={k} style={{ display: "flex", gap: 8 }}>
                            <div style={{ width: 180, color: "#4b5563" }}><b>{k}:</b></div>
                            <div style={{ wordBreak: "break-word" }}>
                              {isSocial ? renderSocialLinks(v) : display}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* If flat contains additional keys not present above, show them */}
              {normalizedFlat && Object.keys(normalizedFlat).length > 0 && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <strong>Flat (raw)</strong>
                    <div>
                      <button className="ducther2" onClick={() => openEditModal()}>Edit</button>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {Object.entries(normalizedFlat).map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 8 }}>
                        <div style={{ width: 180, color: "#4b5563" }}><b>{k}:</b></div>
                        <div style={{ wordBreak: "break-word" }}>
                          {k === "social_links" ? renderSocialLinks(v) : (typeof v === "object" ? JSON.stringify(v) : String(v ?? "-"))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Settings Modal (unchanged form structure, prefilled) */}
      {editOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <h3>Update Application Settings</h3>
            <form className="product-edit-form" onSubmit={handleSaveSettings}>
              <label>
                Site name
                <input name="site_name" value={editForm.site_name} onChange={handleEditChange} />
              </label>

              <label>
                Site tagline
                <input name="site_tagline" value={editForm.site_tagline} onChange={handleEditChange} />
              </label>

              <label>
                Site email
                <input name="site_email" type="email" value={editForm.site_email} onChange={handleEditChange} />
              </label>

              <label>
                Currency name
                <input name="currency_name" value={editForm.currency_name} onChange={handleEditChange} />
              </label>

              <label>
                Currency code
                <input name="currency_code" value={editForm.currency_code} onChange={handleEditChange} />
              </label>

              <label>
                Currency symbol
                <input name="currency_symbol" value={editForm.currency_symbol} onChange={handleEditChange} />
              </label>

              <label>
                Commission rate
                <input name="commission_rate" type="number" step="0.01" value={editForm.commission_rate} onChange={handleEditChange} />
              </label>

              <label>
                Min price
                <input name="min_price" type="number" step="0.01" value={editForm.min_price} onChange={handleEditChange} />
              </label>

              <label>
                Min withdraw
                <input name="min_withdraw" type="number" value={editForm.min_withdraw} onChange={handleEditChange} />
              </label>

              <label>
                Withdraw fee type
                <input name="withdraw_fee_type" value={editForm.withdraw_fee_type} onChange={handleEditChange} />
              </label>

              <label>
                Withdraw fee rate
                <input name="withdraw_fee_rate" type="number" step="0.01" value={editForm.withdraw_fee_rate} onChange={handleEditChange} />
              </label>

              <label>
                Payout hold days
                <input name="payout_hold_days" type="number" value={editForm.payout_hold_days} onChange={handleEditChange} />
              </label>

              <label>
                Support email
                <input name="support_email" value={editForm.support_email} onChange={handleEditChange} />
              </label>

              <label>
                Support phone
                <input name="support_phone" value={editForm.support_phone} onChange={handleEditChange} />
              </label>

              <label>
                Support address
                <input name="support_address" value={editForm.support_address} onChange={handleEditChange} />
              </label>

              <label>
                Social links (JSON/string)
                <textarea name="social_links" rows={3} value={editForm.social_links} onChange={handleEditChange} />
              </label>

             {/* Reg Enabled Toggle */}
<div className="form-group1">
  <label>Registration Enabled</label>
  <label className="switch7">
    <input
      type="checkbox"
      checked={editForm.reg_enabled || false}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          reg_enabled: e.target.checked,
        })
      }
    />
    <span className="slider7 round1"></span>
  </label>
</div>

{/* Email Verify Toggle */}
<div className="form-group2">
  <label>Email Verify</label>
  <label className="switch8">
    <input
      type="checkbox"
      checked={editForm.email_verify || false}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          email_verify: e.target.checked,
        })
      }
    />
    <span className="slider8 round2"></span>
  </label>
</div>

{/* Product Approval Toggle */}
<div className="form-group3">
  <label>Product Approval</label>
  <label className="switch9">
    <input
      type="checkbox"
      checked={editForm.product_approval || false}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          product_approval: e.target.checked,
        })
      }
    />
    <span className="slider9 round3"></span>
  </label>
</div>


              <label>
                Max images
                <input name="max_images" type="number" value={editForm.max_images} onChange={handleEditChange} />
              </label>

              <div className="product-modal-actions" style={{ marginTop: 12 }}>
                <button className="product-btn-update" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                <button type="button" className="product-btn-close" onClick={() => setEditOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flat Details Modal (read-only plain text; clickable social links) */}
      {flatModalOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Flat Setting Details</h3>
              <div>
                {/* No Edit button here - flat is read-only */}
                <button className="product-btn-close" onClick={closeFlatDetails} style={{ marginLeft: 8 }}>Close</button>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              {/* Show plain fields (grouped visually, but read-only). Social links clickable */}
              {/* General */}
              {normalizedFlat && Object.keys(normalizedFlat).length > 0 && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
                  <strong>Flat Settings (plain)</strong>
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    {Object.entries(normalizedFlat).map(([k, v]) => {
                      // if social_links, render clickable links
                      if (k === "social_links") {
                        return (
                          <div key={k} style={{ display: "flex", gap: 8 }}>
                            <div style={{ width: 160, color: "#4b5563" }}><b>{k}:</b></div>
                            <div style={{ wordBreak: "break-word" }}>{renderSocialLinks(v)}</div>
                          </div>
                        );
                      }
                      return (
                        <div key={k} style={{ display: "flex", gap: 8 }}>
                          <div style={{ width: 160, color: "#4b5563" }}><b>{k}:</b></div>
                          <div style={{ wordBreak: "break-word" }}>{typeof v === "object" ? JSON.stringify(v) : String(v ?? "-")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If selectedFlat has other keys (fallback) */}
              {selectedFlat && Object.keys(selectedFlat).length > 0 && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
                  <strong>Other fields</strong>
                  <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
                    {Object.entries(selectedFlat).map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 8 }}>
                        <div style={{ width: 160, color: "#4b5563" }}><b>{k}:</b></div>
                        <div style={{ wordBreak: "break-word" }}>{typeof v === "object" ? JSON.stringify(v) : String(v ?? "-")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
