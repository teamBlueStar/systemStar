#include "TeltonikaProtocol.h"

namespace systemstar {

std::string TeltonikaProtocol::name() const { return "teltonika"; }

bool TeltonikaProtocol::canHandle(const Packet& packet) const {
    const auto& bytes = packet.bytes();
    // Teltonika TCP packets commonly use a 4-byte length prefix followed by
    // Codec 8/8E/16. This is detection only; length and CRC are still required.
    return bytes.size() >= 5 && bytes[0] == 0 && bytes[1] == 0 &&
           (bytes[4] == 0x08 || bytes[4] == 0x8e || bytes[4] == 0x10);
}

std::optional<Position> TeltonikaProtocol::decode(const Packet&) const {
    // TODO: validate length, IMEI, record count and CRC16 before decoding.
    return std::nullopt;
}

}