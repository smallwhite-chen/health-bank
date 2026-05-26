function FavoritesScreen({ navigate, openSheet }) {
  const { favorites } = window.Data;

  return (
    <>
      <TopBar onA11y={() => openSheet && openSheet("a11y")} onReminders={() => navigate("reminders")} onLogo={() => navigate("home")}/>
      <div className="app-scroll">
        <div className="info-banner">
          自訂您的常用功能捷徑，最多可設定 12 個，方便快速存取健康存摺各項服務
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 16px 12px" }}>
          <h1 className="page-title" style={{ margin:0 }}>常用功能</h1>
          <button className="more" onClick={() => navigate("editFavorites")} style={{ display:"inline-flex", alignItems:"center", gap:4, background:"none", border:0, color:"var(--text-secondary)", fontSize: 13 }}>
            <Icon name="edit" size={14}/> 編輯
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
