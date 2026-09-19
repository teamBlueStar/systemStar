#ifndef APPLICATION_H
#define APPLICATION_H

#include <atomic>

class Application {
public:
    Application();

    void run();
    void stop();

private:
    std::atomic<bool> running_;
};

#endif
