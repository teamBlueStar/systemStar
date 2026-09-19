#include "../backend/core/Bootstrap.h"
#include "../backend/utils/Config.h"

#include <cassert>
#include <fstream>
#include <string>

int main()
{
    const std::string logFile = "test_bootstrap.log";

    Config config;

    Bootstrap bootstrap(config, logFile);

    assert(bootstrap.initialize());

    std::ifstream file(logFile);

    assert(file.is_open());

    const std::string content(
        (std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>()
    );

    assert(
        content.find("[INFO] Bootstrap inicializado.")
        != std::string::npos
    );

    return 0;
}
