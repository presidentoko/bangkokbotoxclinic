from cosmetics import vpn_up

def test_dedicated_and_fallback_port_lists():
    assert vpn_up.dedicated_ports() == [2090, 2091]
    assert vpn_up.fallback_ports() == [2086, 2087]

def test_pick_prefers_dedicated_when_all_alive(monkeypatch):
    monkeypatch.setattr(vpn_up, "ports_alive", lambda ports: set(ports))
    assert vpn_up.pick_active_ports() == [2090, 2091]

def test_pick_falls_back_when_dedicated_dead(monkeypatch):
    # dedicated down, fallback up
    monkeypatch.setattr(vpn_up, "ports_alive",
                        lambda ports: set(p for p in ports if p in (2086, 2087)))
    assert vpn_up.pick_active_ports() == [2086, 2087]

def test_pick_returns_partial_fallback(monkeypatch):
    monkeypatch.setattr(vpn_up, "ports_alive",
                        lambda ports: {2087} if 2087 in ports else set())
    assert vpn_up.pick_active_ports() == [2087]

def test_pick_healthy_port_cycles_to_live_one(monkeypatch):
    # 2090 dead, 2091 healthy -> starting at idx 0 still finds 2091
    monkeypatch.setattr(vpn_up, "port_healthy", lambda p, **k: p == 2091)
    assert vpn_up.pick_healthy_port([2090, 2091], 0) == 2091

def test_pick_healthy_port_honors_start_idx(monkeypatch):
    monkeypatch.setattr(vpn_up, "port_healthy", lambda p, **k: True)
    assert vpn_up.pick_healthy_port([2090, 2091], 1) == 2091

def test_pick_healthy_port_none_when_all_dead(monkeypatch):
    monkeypatch.setattr(vpn_up, "port_healthy", lambda p, **k: False)
    assert vpn_up.pick_healthy_port([2090, 2091], 0) is None
