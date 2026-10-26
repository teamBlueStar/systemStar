#include "network/PacketBuffer.h"

#ifdef NDEBUG
#undef NDEBUG
#endif

#include <cassert>
#include <cstdint>
#include <vector>

using namespace systemstar;

int main() {
    PacketBuffer buffer(5);

    assert(buffer.empty());
    assert(buffer.size() == 0);
    assert(buffer.maxSize() == 5);

    const std::uint8_t first[] = {0x01, 0x00};
    const std::uint8_t second[] = {0x02, 0x03};

    // Acumula fragmentos, incluidos bytes binarios nulos.
    assert(buffer.append(first, sizeof(first)));
    assert(buffer.append(second, sizeof(second)));
    assert(buffer.size() == 4);

    const std::vector<std::uint8_t> expected = {
        0x01, 0x00, 0x02, 0x03
    };
    assert(buffer.bytes() == expected);

    // Un append que excede el límite no debe modificar el buffer.
    const std::uint8_t oversized[] = {0x04, 0x05};
    assert(!buffer.append(oversized, sizeof(oversized)));
    assert(buffer.bytes() == expected);

    // Un puntero nulo no es válido cuando hay bytes que añadir.
    assert(!buffer.append(nullptr, 1));
    assert(buffer.bytes() == expected);

    // Añadir cero bytes no modifica el contenido.
    assert(buffer.append(nullptr, 0));
    assert(buffer.bytes() == expected);

    // Consumir más bytes de los disponibles debe fallar sin cambios.
    assert(!buffer.consume(5));
    assert(buffer.bytes() == expected);

    // Consumo parcial.
    assert(buffer.consume(2));
    const std::vector<std::uint8_t> remaining = {0x02, 0x03};
    assert(buffer.bytes() == remaining);

    // Puede volver a llenarse hasta su capacidad máxima.
    const std::uint8_t finalBytes[] = {0x04, 0x05, 0x06};
    assert(buffer.append(finalBytes, sizeof(finalBytes)));
    assert(buffer.size() == 5);

    // Consumir todo deja el buffer vacío.
    assert(buffer.consume(buffer.size()));
    assert(buffer.empty());

    // Limpiar un buffer vacío y uno con datos es válido.
    buffer.clear();
    assert(buffer.empty());

    assert(buffer.append(first, sizeof(first)));
    buffer.clear();
    assert(buffer.empty());
    assert(buffer.size() == 0);

    // Un buffer con capacidad cero no acepta datos.
    PacketBuffer zeroCapacity(0);
    assert(zeroCapacity.empty());
    assert(zeroCapacity.append(nullptr, 0));
    assert(!zeroCapacity.append(first, 1));

    return 0;
}
