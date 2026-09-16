#include "../backend/network/Packet.h"
#include "../backend/models/Position.h"

#include <cassert>
#include <chrono>
#include <cstdint>
#include <vector>

int main() {
    using namespace systemstar;

    // Test Packet
    Packet packet({0x01, 0x02, 0x03});

    assert(!packet.empty());
    assert(packet.size() == 3);
    assert(packet.bytes()[0] == 0x01);
    assert(packet.bytes()[1] == 0x02);
    assert(packet.bytes()[2] == 0x03);

    // Test Position
    Position position(
        "device-001",
        "123456789012345",
        13.6929,
        -89.2182,
        60.0,
        180.0,
        100.0,
        true
    );

    assert(position.deviceId() == "device-001");
    assert(position.imei() == "123456789012345");
    assert(position.latitude() == 13.6929);
    assert(position.longitude() == -89.2182);
    assert(position.speed() == 60.0);
    assert(position.heading() == 180.0);
    assert(position.altitude() == 100.0);
    assert(position.ignition());

    const auto timestamp = std::chrono::system_clock::now();

    position.setTimestamp(timestamp);

    assert(position.timestamp() == timestamp);

    return 0;
}
