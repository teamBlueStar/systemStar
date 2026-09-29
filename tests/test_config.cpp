#include "../backend/utils/Config.h"

#include <cassert>

int main()
{
    Config config;

    // Valor por defecto.
    assert(config.getServerPort() == 5000);

    // Configuración válida.
    assert(config.load("tests/data/config_valid.conf"));
    assert(config.getServerPort() == 5027);

    // Puerto fuera de rango.
    assert(!config.load("tests/data/config_invalid_port.conf"));

    // El valor anterior debe conservarse después del fallo.
    assert(config.getServerPort() == 5027);

    // Valor no numérico.
    assert(!config.load("tests/data/config_invalid_value.conf"));

    // El valor anterior debe conservarse después del fallo.
    assert(config.getServerPort() == 5027);

    // Archivo inexistente.
    assert(!config.load("tests/data/config_no_existe.conf"));

    // El valor anterior debe conservarse después del fallo.
    assert(config.getServerPort() == 5027);

    return 0;
}
