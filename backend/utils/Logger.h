#ifndef LOGGER_H
#define LOGGER_H

#include <fstream>
#include <string>

class Logger {
public:
    Logger(const std::string& logFile,
           const std::string& minimumLevel);

    void info(const std::string& message);
    void warning(const std::string& message);
    void error(const std::string& message);

private:
    std::ofstream logFile_;
    std::string minimumLevel_;

    void write(const std::string& level,
               const std::string& message);
};

#endif
