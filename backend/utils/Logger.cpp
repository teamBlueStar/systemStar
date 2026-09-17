#include "Logger.h"

#include <iostream>

namespace {

int levelPriority(const std::string& level)
{
    if (level == "INFO") {
        return 0;
    }

    if (level == "WARNING") {
        return 1;
    }

    if (level == "ERROR") {
        return 2;
    }

    // Nivel desconocido: tratarlo como ERROR.
    return 2;
}

} // namespace

Logger::Logger(const std::string& logFile,
               const std::string& minimumLevel)
    : logFile_(logFile, std::ios::app),
      minimumLevel_(minimumLevel)
{
}

void Logger::info(const std::string& message)
{
    write("INFO", message);
}

void Logger::warning(const std::string& message)
{
    write("WARNING", message);
}

void Logger::error(const std::string& message)
{
    write("ERROR", message);
}

void Logger::write(const std::string& level,
                   const std::string& message)
{
    if (levelPriority(level) < levelPriority(minimumLevel_)) {
        return;
    }

    const std::string formattedMessage =
        "[" + level + "] " + message;

    std::cout << formattedMessage << '\n';

    if (logFile_.is_open()) {
        logFile_ << formattedMessage << '\n';
        logFile_.flush();
    }
}
