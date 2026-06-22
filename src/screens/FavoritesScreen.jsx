function FavoritesScreen({ navigate, openSheet }) {
  const { favorites } = window.Data;
  const [bannerHidden, setBannerHidden] = React.useState(() => {
    try { return localStorage.getItem("hb_fav_banner_hidden") === "1"; } catch (e) { return false; }
  });
  const hideBanner = () => { try { localStorage.setItem("hb_fav_banner_hidden", "1"); } catch (e) {} setBannerHidden(true); };
  const toggleBanner = () => setBannerHidden((h) => {
    const next = !h;
    try { localStorage.setItem("hb_fav_banner_hidden", next ? "1" : "0"); } catch (e) {}
    return next;
  });

  return (
    <>
      <TopBar onA11y={() => openSheet && openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        {!bannerHidden && (
        <div className="info-banner">
          自訂您的常用功能捷徑，最多可設定 12 個，方便快速存取健康存摺各項服務
          <div>
            <button className="dismiss" onClick={hideBanner}>不再顯示此訊息</button>
          </div>
        </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 16px 12px" }}>
          <h1 className="page-title" style={{ margin:0, display:"inline-flex", alignItems:"center" }}>
            常用功能
            <button
              className="info"
              onClick={toggleBanner}
              aria-label="單元說明"
              style={{ background:"none", border:0, padding:4, cursor:"pointer", color: !bannerHidden ? "var(--brand-700)" : "var(--text-tertiary)" }}
            >
              <Icon name="info" size={18} />
            </button>
          </h1>
          <button className="more" onClick={() => navigate("editFavorites")} style={{ display:"inline-flex", alignItems:"center", gap:4, background:"none", border:0, color:"var(--text-secondary)", fontSize: 13 }}>
            <Icon name="edit" size={14}/> 編輯常用功能
          </button>
        </div>

        <div className="fav-grid">
          {favorites.map((f, i) => (
            f ? (
              <div key={i} className="fav-item">
                <span style={{ color:"var(--text-secondary)", display:"inline-flex" }}><Icon name={f.icon} size={22}/></span>
                <span>{f.label}</span>
              </div>
            ) : (
              <div key={i} className="fav-item empty">
                <Icon name="plus" size={16}/> <span style={{ marginLeft:4 }}>新增</span>
              </div>
            )
          ))}
        </div>

        <div className="h-16"/>
      </div>
    </>
  );
}

window.FavoritesScreen = FavoritesScreen;
