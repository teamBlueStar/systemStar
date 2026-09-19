#ifndef BOOTSTRAP_H
#define BOOTSTRAP_H

#include <string>

class Config;

class Bootstrap {
public:
    Bootstrap(Config& config, const std::string& logFile);

    bool initialize();

private:
    Config& config_;
    std::string logFile_;
};

#endif
