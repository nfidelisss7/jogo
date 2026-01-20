
import React, { useState, useEffect, useRef } from 'react';
import { GameState, WeaponType, WeaponData, BossType } from './types';
import { PowerRegistry } from './powers/index';
import { AiAssistant } from './engine/AiAssistant';
import { AccessoryRegistry } from './accessories/index';
import { AccessoryType } from './types/accessoryTypes';

interface GameUIProps {
  state: GameState;
  upgradeOptions: WeaponType[] | null;
  onSelectUpgrade: (type: WeaponType) => void;
  accessoryOptions: AccessoryType[] | null;
  onSelectAccessory: (type: AccessoryType) => void;
  onRerollUpgrade: () => void;
  onRerollAccessory: () => void;
}

// Icon Mapping
const POWER_ICONS: Record<string, string> = {
  [WeaponType.MISSILE]: "✨",
  [WeaponType.AURA]: "💠",
  [WeaponType.VOID_TETHER]: "🔗",
  [WeaponType.BLOOD_WHIP]: "🩸",
  [WeaponType.SHADOW_SWARM]: "🦇",
  [WeaponType.CRIMSON_BOLT]: "🏹",
  [WeaponType.NIGHT_BLADE]: "⚔️",
  [WeaponType.VAMPIRIC_AURA]: "❤️",
  [WeaponType.DARK_PROJECTILE]: "🌑",
  [WeaponType.BLOOD_ORB]: "🔴",
  [WeaponType.ABYSS_PULL]: "🕳️",
  [WeaponType.HORROR_WAVE]: "🌊",
  [WeaponType.SPECTRAL_CURSE]: "👻",
  [WeaponType.SHADOW_EXPLOSION]: "💥",
  [WeaponType.UMBRA_FAMILIAR]: "🐺",
  [WeaponType.RAZOR_MEADOW]: "🌿",
  [WeaponType.GRIMOIRE_FURY]: "📖",
  [WeaponType.PAPYRUS_LASH]: "📜",
  [WeaponType.PETAL_VORTEX]: "🌸",
  [WeaponType.INKROOT_BIND]: "🦑",
  [WeaponType.THUNDER_ORB]: "⚡",
  [WeaponType.FROST_NOVA]: "❄️",
  [WeaponType.SPLINTER_SHOT]: "✴️",
  [WeaponType.SURVIVOR_BOON]: "💖",
  [WeaponType.CHRONOKINETIC_FIELD]: "⏳",
  [WeaponType.ABYSSAL_BOTANY]: "🥀",
  [WeaponType.AETHER_GOLEM]: "🤖"
};

// --- HELPER: Level Comparison Logic ---
interface UpgradeComparison {
  type: WeaponType;
  isNew: boolean;
  name: string;
  icon: string;
  currentLevel: number;
  currentStats?: Record<string, any>;
  nextStats?: Record<string, any>;
  nextDescription: string;
}

const getUpgradeDetails = (type: WeaponType, currentPowers: WeaponData[]): UpgradeComparison => {
  if (type === WeaponType.SURVIVOR_BOON) {
    return {
      type,
      isNew: false,
      name: "Survivor's Boon",
      icon: "💖",
      currentLevel: 0,
      nextDescription: "Instantly heal 50 HP. A blessing from the void to keep you fighting.",
      nextStats: { "Heal": 50 }
    };
  }

  const existing = currentPowers.find(p => p.type === type);
  const def = PowerRegistry[type]?.definition;

  if (!def) return { type, isNew: true, name: "Unknown", icon: "?", currentLevel: 0, nextDescription: "???" };

  if (existing) {
    const nextLvl = Math.min(existing.level + 1, 5);
    const nextStats = def.levels[nextLvl];
    const currentStats = def.levels[existing.level];

    return {
      type,
      isNew: false,
      name: def.name,
      icon: POWER_ICONS[type] || "✨",
      currentLevel: existing.level,
      currentStats,
      nextStats,
      nextDescription: nextStats.description
    };
  } else {
    const nextStats = def.levels[1];
    return {
      type,
      isNew: true,
      name: def.name,
      icon: POWER_ICONS[type] || "✨",
      currentLevel: 0,
      nextStats,
      nextDescription: nextStats.description
    };
  }
};

// --- COMPONENTS ---

const PowerCard: React.FC<{ details: UpgradeComparison, onClick: () => void, index: number }> = ({ details, onClick, index }) => {
  const formatStat = (key: string, val: any) => {
    if (key === 'cooldown') return `${(val/1000).toFixed(1)}s`;
    if (key === 'damage') return Math.floor(val);
    if (key === 'duration') return `${(val/1000).toFixed(1)}s`;
    return val;
  };

  const renderStatDiff = () => {
    if (details.isNew || !details.currentStats || !details.nextStats) {
      return Object.entries(details.nextStats || {})
        .filter(([k]) => ['damage', 'cooldown', 'range', 'projectileCount', 'duration'].includes(k))
        .map(([k, v]) => (
          <div key={k} className="stat-row">
            <span style={{textTransform: 'capitalize'}}>{k.replace('projectileCount', 'Count')}</span>
            <span className="val-improved">{formatStat(k, v)}</span>
          </div>
        ));
    }

    return Object.keys(details.nextStats).map(key => {
      if (!['damage', 'cooldown', 'range', 'projectileCount', 'duration', 'speed'].includes(key)) return null;
      const curr = details.currentStats![key];
      const next = details.nextStats![key];
      if (curr === next) return null;
      const isBetter = key === 'cooldown' ? next < curr : next > curr;
      return (
        <div key={key} className="stat-row">
          <span style={{textTransform: 'capitalize'}}>{key.replace('projectileCount', 'Count')}</span>
          <div>
            <span style={{ opacity: 0.7 }}>{formatStat(key, curr)}</span>
            <span className="stat-arrow">➤</span>
            <span className={isBetter ? "val-improved" : ""}>{formatStat(key, next)}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="power-card" onClick={onClick}>
      <div className="key-hint">{index + 1}</div>
      <div className="card-header">
        <div className="card-icon-frame">{details.icon}</div>
        <div className="card-title-group">
          <div className="card-name">{details.name}</div>
          <div className={`card-tag ${details.isNew ? 'tag-new' : 'tag-upgrade'}`}>
            {details.isNew ? 'NEW ABILITY' : `UPGRADE TO LV ${details.currentLevel + 1}`}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="stat-block">
          <div className="stat-block-title">Combat Statistics</div>
          {renderStatDiff()}
        </div>
        <div className="description-text">"{details.nextDescription}"</div>
      </div>
      <div className="card-footer">
        <button className="select-btn">SELECT</button>
      </div>
    </div>
  );
};

const BossHealthBar: React.FC<{ data: NonNullable<GameState['activeBossData']> }> = ({ data }) => {
  const percent = Math.max(0, (data.hp / data.maxHp) * 100);
  
  return (
    <div className="boss-bar-container">
      <div className="boss-name">{data.name}</div>
      <div className="boss-hp-track">
        <div className="boss-hp-fill" style={{ width: `${percent}%` }} />
        <div className="boss-hp-text">{Math.ceil(data.hp)} / {Math.ceil(data.maxHp)}</div>
      </div>
    </div>
  );
};

const DamageVignette: React.FC<{ hp: number, maxHp: number }> = ({ hp, maxHp }) => {
  const healthPct = hp / maxHp;
  if (healthPct > 0.4) return null;
  
  const intensity = (1 - (healthPct / 0.4)); // 0 to 1
  return (
    <div 
      className="damage-vignette" 
      style={{ opacity: intensity * 0.8 }} 
    />
  );
};

// --- MAIN UI ---

const GameUI: React.FC<GameUIProps> = ({ 
  state, upgradeOptions, onSelectUpgrade, 
  accessoryOptions, onSelectAccessory, 
  onRerollUpgrade, onRerollAccessory 
}) => {
  const [grimoireOpen, setGrimoireOpen] = useState(false);
  const [grimoireMode, setGrimoireMode] = useState<'chat' | 'vision'>('chat');
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Config Toggles
  const [useSearch, setUseSearch] = useState(false);
  const [useThinking, setUseThinking] = useState(false);

  // Vision Mode
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (upgradeOptions) {
        if (e.key === '1') onSelectUpgrade(upgradeOptions[0]);
        if (e.key === '2' && upgradeOptions[1]) onSelectUpgrade(upgradeOptions[1]);
        if (e.key === '3' && upgradeOptions[2]) onSelectUpgrade(upgradeOptions[2]);
      }
      if (accessoryOptions) {
        if (e.key === '1') onSelectAccessory(accessoryOptions[0]);
        if (e.key === '2' && accessoryOptions[1]) onSelectAccessory(accessoryOptions[1]);
        if (e.key === '3' && accessoryOptions[2]) onSelectAccessory(accessoryOptions[2]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [upgradeOptions, accessoryOptions, onSelectUpgrade, onSelectAccessory]);

  const xpPercent = Math.min(100, (state.xp / state.requiredXp) * 100);
  const hpPercent = Math.min(100, (state.hp / state.maxHp) * 100);
  
  const formattedTime = () => {
    const s = Math.floor(state.timer / 1000);
    return `${Math.floor(s/60)}:${(s%60).toString().padStart(2, '0')}`;
  };

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    
    if (grimoireMode === 'chat') {
        const result = await AiAssistant.queryTheVoid(query, { useSearch, useThinking });
        setAiResponse(result);
    } else {
        // Vision Mode: Capture Canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const base64 = canvas.toDataURL('image/png');
            const resultImg = await AiAssistant.distortReality(base64, query);
            setGeneratedImage(resultImg);
        }
    }
    
    setIsLoading(false);
  };

  const renderGrounding = () => {
    if (!aiResponse?.groundingMetadata?.groundingChunks) return null;
    return (
        <div className="grounding-sources">
            <div className="grounding-title">Sources from the Aether:</div>
            {aiResponse.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                chunk.web ? (
                    <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="grounding-link">
                        {chunk.web.title}
                    </a>
                ) : null
            ))}
        </div>
    );
  };

  return (
    <div className="gothic-hud">
      
      <DamageVignette hp={state.hp} maxHp={state.maxHp} />

      {/* --- INFESTATION WARNING --- */}
      {state.infestationMessage && (
        <div className="infestation-warning-overlay">
          <div className="infestation-text">{state.infestationMessage}</div>
        </div>
      )}

      {/* --- BOSS BAR (Top Center, if active) --- */}
      {state.activeBossData && (
        <div className="boss-area">
          <BossHealthBar data={state.activeBossData} />
        </div>
      )}

      {/* --- TOP BAR --- */}
      <div className="top-section">
        <div className="stat-widget">
          <div className="stat-label">Time</div>
          <div className="stat-value">{formattedTime()}</div>
        </div>

        <div className="xp-widget">
          <div className="level-badge">
            <span className="lvl-text">LVL</span>
            <span className="lvl-num">{state.level}</span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
            <div className="xp-shine" />
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-label">Souls</div>
          <div className="stat-value" style={{ color: '#ff4444' }}>{state.killCount}</div>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="bottom-section">
        
        {/* Health Orb (Left) */}
        <div className="health-cluster">
          <div className="health-orb-frame">
            <div className="health-liquid" style={{ height: `${hpPercent}%` }} />
            <div className="health-overlay-shine" />
            <div className="health-text">{Math.ceil(state.hp)}</div>
          </div>
        </div>

        {/* Powers Dock (Center) */}
        <div className="dock-container">
          <div className="active-powers">
            {state.activePowers.map((p, i) => (
              <div key={i} className="power-slot active" title={p.type}>
                <div className="slot-icon">{POWER_ICONS[p.type] || "?"}</div>
                <div className="slot-level">LV {p.level}</div>
              </div>
            ))}
            {Array.from({ length: 6 - state.activePowers.length }).map((_, i) => (
              <div key={`empty-${i}`} className="power-slot"></div>
            ))}
          </div>
          
          {/* Accessories Row */}
          <div className="accessory-row">
             {state.equippedAccessories.map((acc, i) => (
               <div key={i} className="acc-slot filled" title={acc.type}>
                 <div className="acc-gem" />
               </div>
             ))}
             {Array.from({ length: 4 - state.equippedAccessories.length }).map((_, i) => (
                <div key={`acc-empty-${i}`} className="acc-slot"></div>
             ))}
          </div>
        </div>

        {/* Utils (Right) */}
        <div className="stat-widget" style={{ minWidth: 'auto', cursor: 'pointer' }} onClick={() => setGrimoireOpen(!grimoireOpen)}>
          <div className="stat-label">Grimoire</div>
          <div className="stat-value">📖</div>
        </div>
      </div>

      {/* --- GRIMOIRE PANEL --- */}
      {grimoireOpen && (
        <div className="grimoire-panel">
          <div className="grimoire-header">THE VOID GRIMOIRE</div>
          
          {/* Grimoire Tabs */}
          <div className="grimoire-tabs">
              <button 
                className={`tab-btn ${grimoireMode === 'chat' ? 'active' : ''}`}
                onClick={() => setGrimoireMode('chat')}
              >
                WHISPER
              </button>
              <button 
                className={`tab-btn ${grimoireMode === 'vision' ? 'active' : ''}`}
                onClick={() => setGrimoireMode('vision')}
              >
                VISION
              </button>
          </div>

          <div className="grimoire-body">
            {isLoading ? (
              <div style={{ fontStyle: 'italic', opacity: 0.7 }}>
                  {grimoireMode === 'chat' ? (useThinking ? "Deeply contemplating..." : "Consulting the void...") : "Distorting reality..."}
              </div>
            ) : (
                <>
                    {/* Chat Mode Display */}
                    {grimoireMode === 'chat' && (
                        aiResponse ? (
                            <>
                                <div style={{whiteSpace: 'pre-wrap'}}>{aiResponse.text}</div>
                                {renderGrounding()}
                            </>
                        ) : <div style={{ fontStyle: 'italic', opacity: 0.5 }}>Ask the void for guidance...</div>
                    )}

                    {/* Vision Mode Display */}
                    {grimoireMode === 'vision' && (
                        generatedImage ? (
                            <img src={generatedImage} alt="Distorted Reality" style={{width: '100%', border: '1px solid #444'}} />
                        ) : <div style={{ fontStyle: 'italic', opacity: 0.5 }}>Describe how to warp the current reality...</div>
                    )}
                </>
            )}
          </div>

          {/* Config Controls */}
          {grimoireMode === 'chat' && (
              <div className="grimoire-controls">
                  <label className="checkbox-label" title="Use Google Search Data">
                      <input type="checkbox" checked={useSearch} onChange={(e) => { setUseSearch(e.target.checked); if(e.target.checked) setUseThinking(false); }} />
                      <span>Search Archives</span>
                  </label>
                  <label className="checkbox-label" title="Use Deep Thinking Model">
                      <input type="checkbox" checked={useThinking} onChange={(e) => { setUseThinking(e.target.checked); if(e.target.checked) setUseSearch(false); }} />
                      <span>Deep Meditation</span>
                  </label>
              </div>
          )}

          <form onSubmit={handleAiQuery} className="grimoire-input-area">
            <input 
              type="text" 
              className="dark-input"
              placeholder={grimoireMode === 'chat' ? "Ask..." : "e.g. Add a retro glitch filter"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="stone-btn" style={{ fontSize: '10px' }}>
                {grimoireMode === 'chat' ? "ASK" : "CAST"}
            </button>
          </form>
        </div>
      )}

      {/* --- LEVEL UP MODAL --- */}
      {upgradeOptions && (
        <div className="modal-backdrop">
          <div className="selection-container">
            <h1 className="modal-title">CHOOSE YOUR FATE</h1>
            <div className="cards-row">
              {upgradeOptions.map((type, idx) => {
                const details = getUpgradeDetails(type, state.activePowers);
                return (
                  <PowerCard 
                    key={type} 
                    details={details} 
                    index={idx}
                    onClick={() => onSelectUpgrade(type)} 
                  />
                );
              })}
            </div>
            
            <button 
              className="reroll-btn"
              onClick={onRerollUpgrade}
              disabled={!state.powerRerolls || state.powerRerolls <= 0}
            >
              🎲 REROLL FATE ({state.powerRerolls || 0} LEFT)
            </button>
          </div>
        </div>
      )}

      {/* --- ACCESSORY SELECTION MODAL --- */}
      {accessoryOptions && (
        <div className="modal-backdrop">
          <div className="selection-container">
            <h1 className="modal-title" style={{ color: '#00ffff' }}>ANCIENT RELIC FOUND</h1>
            <div className="cards-row">
              {accessoryOptions.map((type, idx) => {
                const mod = AccessoryRegistry[type];
                const def = mod?.definition || { 
                    name: "Unknown Relic", 
                    stats: { description: "An unidentified artifact." } 
                };
                
                return (
                  <div key={type} className="power-card" style={{ borderColor: '#00ffff' }} onClick={() => onSelectAccessory(type)}>
                    <div className="key-hint">{idx+1}</div>
                    <div className="card-header">
                      <div className="card-icon-frame" style={{ borderColor: '#00ffff' }}>💍</div>
                      <div className="card-title-group">
                        <div className="card-name" style={{ color: '#00ffff' }}>{def.name}</div>
                        <div className="card-tag" style={{ color: '#00ffff', borderColor: '#00ffff' }}>ACCESSORY</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="description-text" style={{ fontStyle: 'normal', color: '#fff' }}>
                        {def.stats.description}
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="select-btn" style={{ background: '#00bcd4', color: '#000' }}>EQUIP</button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              className="reroll-btn"
              onClick={onRerollAccessory}
              disabled={!state.accessoryRerolls || state.accessoryRerolls <= 0}
            >
              🎲 REROLL RELICS ({state.accessoryRerolls || 0} LEFT)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default GameUI;
