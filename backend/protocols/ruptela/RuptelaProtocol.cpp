#include "RuptelaProtocol.h"

namespace systemstar {

std::string RuptelaProtocol::name() const { return "ruptela"; }

bool RuptelaProtocol::canHandle(const Packet& packet) const {
    const auto& bytes = packet.bytes();
    // Ruptela variants use binary length/type headers. Keep this heuristic
    // conservative and require a protocol-specific fixture before production.
    return bytes.size() >= 4 && bytes[0] != '*' && bytes[0] != '$' &&
           bytes[1] != 0xff;
}

std::optional<Position> RuptelaProtocol::decode(const Packet&) const {
    // TODO: implement the selected Ruptela binary version and checksum.
    return std::nullopt;
}

}