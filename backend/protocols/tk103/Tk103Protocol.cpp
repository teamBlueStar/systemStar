#include "Tk103Protocol.h"

#include <algorithm>
#include <string>

namespace systemstar {

std::string Tk103Protocol::name() const { return "tk103"; }

bool Tk103Protocol::canHandle(const Packet& packet) const {
    const std::string text(packet.bytes().begin(), packet.bytes().end());
    return text.find("imei") != std::string::npos ||
           text.find("tracker") != std::string::npos;
}

std::optional<Position> Tk103Protocol::decode(const Packet&) const {
    // TODO: parse the configured TK103 dialect and normalize UTC coordinates.
    return std::nullopt;
}

}