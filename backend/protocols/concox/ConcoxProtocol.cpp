#include "ConcoxProtocol.h"

namespace systemstar {

std::string ConcoxProtocol::name() const { return "concox"; }

bool ConcoxProtocol::canHandle(const Packet& packet) const {
    const auto& bytes = packet.bytes();
    if (bytes.size() < 3) return false;
    return bytes[0] == '*' && bytes[1] == 'H' && bytes[2] == 'Q';
}

std::optional<Position> ConcoxProtocol::decode(const Packet&) const {
    // TODO: implement model-specific login, position and ACK frames.
    return std::nullopt;
}

}