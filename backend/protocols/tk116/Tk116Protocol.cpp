#include "Tk116Protocol.h"

#include <string>

namespace systemstar {

std::string Tk116Protocol::name() const { return "tk116"; }

bool Tk116Protocol::canHandle(const Packet& packet) const {
    const std::string text(packet.bytes().begin(), packet.bytes().end());
    return text.find("TK116") != std::string::npos ||
           text.find("tk116") != std::string::npos;
}

std::optional<Position> Tk116Protocol::decode(const Packet&) const {
    // TODO: confirm TK116 framing and fields with a real device fixture.
    return std::nullopt;
}

}