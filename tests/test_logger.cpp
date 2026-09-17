#include "../backend/utils/Logger.h"

#include <cassert>
#include <fstream>
#include <string>

namespace {

std::string readFile(const std::string& filename)
{
    std::ifstream file(filename);

    assert(file.is_open());

    return std::string(
        (std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>()
    );
}

} // namespace

int main()
{
    // Test INFO: deben registrarse los tres niveles.
    const std::string infoLog = "test_logger_info.log";

    Logger infoLogger(infoLog, "INFO");

    infoLogger.info("Mensaje de información");
    infoLogger.warning("Mensaje de advertencia");
    infoLogger.error("Mensaje de error");

    const std::string infoContent = readFile(infoLog);

    assert(
        infoContent.find("[INFO] Mensaje de información")
        != std::string::npos
    );

    assert(
        infoContent.find("[WARNING] Mensaje de advertencia")
        != std::string::npos
    );

    assert(
        infoContent.find("[ERROR] Mensaje de error")
        != std::string::npos
    );

    // Test WARNING: INFO debe filtrarse.
    const std::string warningLog = "test_logger_warning.log";

    Logger warningLogger(warningLog, "WARNING");

    warningLogger.info("INFO filtrado");
    warningLogger.warning("WARNING registrado");
    warningLogger.error("ERROR registrado");

    const std::string warningContent = readFile(warningLog);

    assert(
        warningContent.find("[INFO] INFO filtrado")
        == std::string::npos
    );

    assert(
        warningContent.find("[WARNING] WARNING registrado")
        != std::string::npos
    );

    assert(
        warningContent.find("[ERROR] ERROR registrado")
        != std::string::npos
    );

    // Test ERROR: solamente ERROR debe registrarse.
    const std::string errorLog = "test_logger_error.log";

    Logger errorLogger(errorLog, "ERROR");

    errorLogger.info("INFO filtrado");
    errorLogger.warning("WARNING filtrado");
    errorLogger.error("ERROR registrado");

    const std::string errorContent = readFile(errorLog);

    assert(
        errorContent.find("[INFO] INFO filtrado")
        == std::string::npos
    );

    assert(
        errorContent.find("[WARNING] WARNING filtrado")
        == std::string::npos
    );

    assert(
        errorContent.find("[ERROR] ERROR registrado")
        != std::string::npos
    );

    return 0;
}
